import { desc, eq } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';

import { validateTripInput } from '@/features/trips/validateTrip';
import { ServiceError } from '@/services/errors';
import type { Trip, TripInput, TripUpdate } from '@/types';

import { db } from './client';
import { toTrip } from './mappers';
import { trips } from './schema';
import { withDatabase } from './withDatabase';

export async function listTrips(): Promise<Trip[]> {
  return withDatabase('listTrips', async () => {
    const rows = await db.select().from(trips).orderBy(desc(trips.startAt));
    return rows.map(toTrip);
  });
}

export async function getTrip(tripId: string): Promise<Trip> {
  return withDatabase('getTrip', async () => {
    const row = await db.query.trips.findFirst({ where: eq(trips.id, tripId) });
    if (!row) {
      throw new ServiceError('not_found', { userMessage: 'We couldn’t find that trip.' });
    }
    return toTrip(row);
  });
}

export async function createTrip(input: TripInput): Promise<Trip> {
  const clean = validateTripInput(input);
  return withDatabase('createTrip', async () => {
    const now = new Date();
    const [row] = await db
      .insert(trips)
      .values({
        id: randomUUID(),
        name: clean.name,
        startAt: clean.startAt,
        endAt: clean.endAt,
        homeGeofence: clean.homeGeofence ?? null,
        destinations: clean.destinations ?? [],
        coverImageRef: clean.coverImageRef ?? null,
        tags: clean.tags ?? [],
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    if (!row) {
      throw new ServiceError('database', { message: 'Insert returned no row' });
    }
    return toTrip(row);
  });
}

/** Applies a partial update. The merged trip is re-validated so dates stay consistent. */
export async function updateTrip(tripId: string, update: TripUpdate): Promise<Trip> {
  const existing = await getTrip(tripId);
  const clean = validateTripInput({
    name: update.name ?? existing.name,
    startAt: update.startAt ?? existing.startAt,
    endAt: update.endAt !== undefined ? update.endAt : existing.endAt,
    homeGeofence: update.homeGeofence !== undefined ? update.homeGeofence : existing.homeGeofence,
    destinations: update.destinations ?? existing.destinations,
    coverImageRef:
      update.coverImageRef !== undefined ? update.coverImageRef : existing.coverImageRef,
    tags: update.tags ?? existing.tags,
  });

  return withDatabase('updateTrip', async () => {
    const [row] = await db
      .update(trips)
      .set({
        name: clean.name,
        startAt: clean.startAt,
        endAt: clean.endAt,
        homeGeofence: clean.homeGeofence ?? null,
        destinations: clean.destinations ?? [],
        coverImageRef: clean.coverImageRef ?? null,
        tags: clean.tags ?? [],
        updatedAt: new Date(),
      })
      .where(eq(trips.id, tripId))
      .returning();
    if (!row) {
      throw new ServiceError('not_found', { userMessage: 'We couldn’t find that trip.' });
    }
    return toTrip(row);
  });
}

/** Deletes the trip. Timeline entries and daily activity are removed by cascading foreign keys. */
export async function deleteTrip(tripId: string): Promise<void> {
  return withDatabase('deleteTrip', async () => {
    await db.delete(trips).where(eq(trips.id, tripId));
  });
}

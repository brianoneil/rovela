import type { ImportRange, ImportedDailyActivity, ImportedEntry } from '@/services/import/types';
import type { DailyActivity, TimelineEntry, Trip } from '@/types';

/** An active trip (no end date yet) imports up to the current moment. */
export function getTripImportRange(trip: Trip, now: Date): ImportRange {
  return { start: trip.startAt, end: trip.endAt ?? now };
}

export function attachEntriesToTrip(
  entries: ImportedEntry[],
  tripId: string,
  createId: () => string,
  now: Date,
): TimelineEntry[] {
  return entries.map((entry) => ({ ...entry, id: createId(), tripId, createdAt: now }));
}

export function attachActivityToTrip(
  days: ImportedDailyActivity[],
  tripId: string,
  now: Date,
): DailyActivity[] {
  return days.map((day) => ({ ...day, tripId, updatedAt: now }));
}

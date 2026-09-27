import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { listTimelineEntries, listTimelineEntriesByType } from '@/db/timelineRepository';
import { tripKeys } from '@/features/trips/queryKeys';
import { useTrips } from '@/features/trips/useTrips';
import type { ServiceError } from '@/services/errors';
import type { TimelineEntry } from '@/types';

import { sumFootDistanceKm } from './footDistance';
import { findTripMemory, photosOnDay, pickDayPhotoAssetId, type TripMemory } from './tripMemory';
import { findUpcomingTrip } from './upcomingTrip';

export interface MemoryDetails {
  photoCount: number;
  /** Asset to show in the hero: the day's chosen photo, else the trip cover, else none. */
  heroAssetId: string | null;
}

/** Everything Home shows, derived from local trip data. */
export function useHomeData() {
  const trips = useTrips();
  // Re-derives when the calendar day changes while the app stays open.
  const todayKey = new Date().toDateString();

  const memory = useMemo(
    () => findTripMemory(trips.data ?? [], new Date(todayKey)),
    [trips.data, todayKey],
  );
  // Compared against the current moment so a trip that started earlier today is no longer "next".
  const upcoming = findUpcomingTrip(trips.data ?? [], new Date());

  const workouts = useQuery<TimelineEntry[], ServiceError>({
    queryKey: tripKeys.entriesByType('workout'),
    queryFn: () => listTimelineEntriesByType('workout'),
  });

  return {
    trips,
    memory,
    upcoming,
    footDistanceKm: workouts.data ? sumFootDistanceKm(workouts.data) : null,
  };
}

/** Photo count and hero photo for the anniversary day. */
export function useMemoryDetails(memory: TripMemory | null) {
  const tripId = memory?.trip.id ?? '';
  const entries = useQuery<TimelineEntry[], ServiceError>({
    queryKey: tripKeys.timeline(tripId),
    queryFn: () => listTimelineEntries(tripId),
    enabled: memory !== null,
  });

  return useMemo<MemoryDetails | null>(() => {
    if (!memory || !entries.data) {
      return null;
    }
    const photos = photosOnDay(entries.data, memory.date);
    return {
      photoCount: photos.length,
      heroAssetId: pickDayPhotoAssetId(photos) ?? memory.trip.coverImageRef,
    };
  }, [memory, entries.data]);
}

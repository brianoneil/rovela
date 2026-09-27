import { useMemo } from 'react';

import type { Trip } from '@/types';

import { buildTripRoute, type TripRoutePoint } from './tripRoute';
import { useTimelineEntries } from './useTrips';

/** Every known position of a trip in time order, tagged with its trip day. */
export function useTripRoute(trip: Trip): { route: TripRoutePoint[]; isLoading: boolean } {
  const entries = useTimelineEntries(trip.id);
  const route = useMemo(
    () => (entries.data ? buildTripRoute(entries.data, trip.startAt) : []),
    [entries.data, trip.startAt],
  );
  return { route, isLoading: entries.isLoading };
}

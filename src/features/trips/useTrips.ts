import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { listDailyActivity, listTimelineEntries } from '@/db/timelineRepository';
import { createTrip, deleteTrip, getTrip, listTrips, updateTrip } from '@/db/tripRepository';
import type { ServiceError } from '@/services/errors';
import type { DailyActivity, TimelineEntry, Trip, TripInput, TripUpdate } from '@/types';

import { tripKeys } from './queryKeys';

export function useTrips() {
  return useQuery<Trip[], ServiceError>({ queryKey: tripKeys.list(), queryFn: listTrips });
}

export function useTrip(tripId: string) {
  return useQuery<Trip, ServiceError>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => getTrip(tripId),
  });
}

export function useTimelineEntries(tripId: string) {
  return useQuery<TimelineEntry[], ServiceError>({
    queryKey: tripKeys.timeline(tripId),
    queryFn: () => listTimelineEntries(tripId),
  });
}

export function useDailyActivity(tripId: string) {
  return useQuery<DailyActivity[], ServiceError>({
    queryKey: tripKeys.dailyActivity(tripId),
    queryFn: () => listDailyActivity(tripId),
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation<Trip, ServiceError, TripInput>({
    mutationFn: createTrip,
    onSuccess: (trip) => {
      queryClient.setQueryData(tripKeys.detail(trip.id), trip);
      return queryClient.invalidateQueries({ queryKey: tripKeys.list() });
    },
  });
}

export function useUpdateTrip(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation<Trip, ServiceError, TripUpdate>({
    mutationFn: (update) => updateTrip(tripId, update),
    onSuccess: (trip) => {
      queryClient.setQueryData(tripKeys.detail(trip.id), trip);
      return queryClient.invalidateQueries({ queryKey: tripKeys.list() });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation<void, ServiceError, string>({
    mutationFn: deleteTrip,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.all }),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tripKeys } from '@/features/trips/queryKeys';
import type { ServiceError } from '@/services/errors';
import type { TripImportSummary } from '@/services/import/types';
import type { Trip } from '@/types';

import { runTripImport, type TripImportOptions } from './runTripImport';

interface TripImportVariables {
  trip: Trip;
  options?: TripImportOptions;
}

/** Runs a retroactive import and refreshes the trip's timeline and step totals afterwards. */
export function useTripImport() {
  const queryClient = useQueryClient();
  return useMutation<TripImportSummary, ServiceError, TripImportVariables>({
    mutationFn: ({ trip, options }) => runTripImport(trip, options),
    onSuccess: (summary) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: tripKeys.timeline(summary.tripId) }),
        queryClient.invalidateQueries({ queryKey: tripKeys.dailyActivity(summary.tripId) }),
        queryClient.invalidateQueries({ queryKey: [...tripKeys.all, 'entriesByType'] }),
      ]),
  });
}

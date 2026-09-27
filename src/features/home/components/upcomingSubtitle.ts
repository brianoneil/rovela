import type { Trip } from '@/types';
import { formatTripDateRange } from '@/utils/formatTrip';

/**
 * "Oct 19 – 30 · Patagonia" — the date range plus the first destination when the trip has one.
 * TODO: Add the "flight found in calendar" note from the design once flights are detected.
 */
export function upcomingSubtitle(trip: Trip): string {
  const range = formatTripDateRange(trip.startAt, trip.endAt);
  const destination = trip.destinations[0];
  return destination ? `${range} · ${destination}` : range;
}

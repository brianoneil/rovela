import type { Trip } from '@/types';
import { localDaysBetween } from '@/utils/dates';

export interface UpcomingTrip {
  trip: Trip;
  /** Local calendar days until the trip starts (1 = tomorrow). */
  daysUntil: number;
}

/** The soonest trip that hasn't started yet, or null when none is planned. */
export function findUpcomingTrip(trips: Trip[], now: Date): UpcomingTrip | null {
  let soonest: Trip | null = null;
  for (const trip of trips) {
    if (trip.startAt.getTime() > now.getTime()) {
      if (!soonest || trip.startAt.getTime() < soonest.startAt.getTime()) {
        soonest = trip;
      }
    }
  }
  return soonest ? { trip: soonest, daysUntil: localDaysBetween(now, soonest.startAt) } : null;
}

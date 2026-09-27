import type { TimelineEntry, Trip } from '@/types';
import { localDaysBetween, startOfLocalDay, toLocalDateKey } from '@/utils/dates';

export interface TripMemory {
  trip: Trip;
  yearsAgo: number;
  /** The anniversary day inside the trip, `YYYY-MM-DD`. */
  date: string;
  /** 1-based day of the trip that the anniversary falls on. */
  dayNumber: number;
}

/**
 * Finds a finished trip from an earlier year that was underway on today's month and day.
 *
 * For each trip, today's month/day is placed into every year the trip spans; if that day falls
 * within the trip it's a memory. Feb 29 only matches in leap years (no shifting to Feb 28).
 * When several trips match, the most recent one wins.
 */
export function findTripMemory(trips: Trip[], today: Date): TripMemory | null {
  let best: TripMemory | null = null;
  for (const trip of trips) {
    if (!trip.endAt) {
      continue;
    }
    for (let year = trip.startAt.getFullYear(); year <= trip.endAt.getFullYear(); year += 1) {
      const yearsAgo = today.getFullYear() - year;
      if (yearsAgo < 1) {
        continue;
      }
      const candidate = new Date(year, today.getMonth(), today.getDate());
      if (candidate.getMonth() !== today.getMonth()) {
        continue;
      }
      const withinTrip =
        candidate.getTime() >= startOfLocalDay(trip.startAt).getTime() &&
        candidate.getTime() <= trip.endAt.getTime();
      if (withinTrip && (!best || yearsAgo < best.yearsAgo)) {
        best = {
          trip,
          yearsAgo,
          date: toLocalDateKey(candidate),
          dayNumber: localDaysBetween(trip.startAt, candidate) + 1,
        };
      }
    }
  }
  return best;
}

/** Photos taken on the given local day, in capture order. */
export function photosOnDay(entries: TimelineEntry[], date: string): TimelineEntry[] {
  return entries.filter(
    (entry) => entry.type === 'photo' && toLocalDateKey(entry.timestamp) === date,
  );
}

/**
 * The photo that represents a day: the first one the user marked as a favorite, otherwise the
 * first photo of the day. Returns the media library asset id, or null when the day has no photos.
 */
export function pickDayPhotoAssetId(photos: TimelineEntry[]): string | null {
  const chosen = photos.find((photo) => photo.payload.isFavorite === true) ?? photos[0];
  const assetId = chosen?.payload.assetId;
  return typeof assetId === 'string' ? assetId : null;
}

/** "One year ago today" / "3 years ago today" */
export function formatYearsAgo(yearsAgo: number): string {
  if (yearsAgo === 1) {
    return 'One year ago today';
  }
  return `${yearsAgo} years ago today`;
}

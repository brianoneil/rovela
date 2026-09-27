import { dayColors } from './tokens';

/**
 * Returns the track color for a trip day (1-based: day 1 is the first day of the trip).
 *
 * Paper defines five day colors. The current Paper designs (Map scrubber, Story chapter list)
 * repeat the sequence for days 6+, so day 6 uses day 1's color, day 7 uses day 2's, and so on.
 * TODO: Replace the repeat once the "days beyond 5" color decision is made in Paper.
 */
export function getDayColor(dayNumber: number): string {
  if (!Number.isInteger(dayNumber) || dayNumber < 1) {
    throw new RangeError(`Trip day must be a positive integer, received ${dayNumber}`);
  }
  const color = dayColors[(dayNumber - 1) % dayColors.length];
  if (color === undefined) {
    throw new RangeError(`No day color defined for day ${dayNumber}`);
  }
  return color;
}

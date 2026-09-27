import { localDaysBetween } from './dates';

/**
 * Compact trip date range in the device locale, collapsing shared parts:
 * "Oct 19 – 30", "Oct 28 – Nov 3", "Dec 28, 2026 – Jan 3, 2027". Active trips read "From Oct 19".
 */
export function formatTripDateRange(start: Date, end: Date | null, locale?: string): string {
  const monthDay = (date: Date) =>
    date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  if (!end) {
    return `From ${monthDay(start)}`;
  }
  if (start.getFullYear() !== end.getFullYear()) {
    const full = (date: Date) =>
      date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${full(start)} – ${full(end)}`;
  }
  if (start.getMonth() === end.getMonth()) {
    return `${monthDay(start)} – ${end.getDate()}`;
  }
  return `${monthDay(start)} – ${monthDay(end)}`;
}

/** "Feb 2026" */
export function formatTripMonth(start: Date, locale?: string): string {
  return start.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}

/** Number of local calendar days a trip touches, counting both the first and last day. */
export function tripDayCount(start: Date, end: Date): number {
  return localDaysBetween(start, end) + 1;
}

/** "1 day" / "8 days" */
export function formatDayCount(count: number): string {
  return count === 1 ? '1 day' : `${count} days`;
}

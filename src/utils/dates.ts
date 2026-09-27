/** Local calendar day for a date, formatted `YYYY-MM-DD` (the device's time zone). */
export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Local midnight at the start of the given date's day. */
export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Whole local calendar days from `from` to `to` (0 when both fall on the same day, negative when
 * `to` is earlier). Rounding absorbs the 23h / 25h days around daylight-saving changes.
 */
export function localDaysBetween(from: Date, to: Date): number {
  return Math.round((startOfLocalDay(to).getTime() - startOfLocalDay(from).getTime()) / MS_PER_DAY);
}

/**
 * Splits a range into local calendar days, each clipped to the range.
 * Uses calendar arithmetic (not +24h) so days stay correct across daylight-saving changes.
 */
export function splitIntoLocalDays(start: Date, end: Date): { start: Date; end: Date }[] {
  if (end.getTime() <= start.getTime()) {
    return [];
  }
  const days: { start: Date; end: Date }[] = [];
  let dayStart = startOfLocalDay(start);
  while (dayStart.getTime() < end.getTime()) {
    const nextDay = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate() + 1);
    days.push({
      start: new Date(Math.max(dayStart.getTime(), start.getTime())),
      end: new Date(Math.min(nextDay.getTime(), end.getTime())),
    });
    dayStart = nextDay;
  }
  return days;
}

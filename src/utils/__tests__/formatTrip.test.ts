import { formatDayCount, formatTripDateRange, formatTripMonth, tripDayCount } from '../formatTrip';

describe('formatTripDateRange', () => {
  it('collapses the shared month', () => {
    expect(formatTripDateRange(new Date(2026, 9, 19), new Date(2026, 9, 30), 'en-US')).toBe(
      'Oct 19 – 30',
    );
  });

  it('shows both months when they differ', () => {
    expect(formatTripDateRange(new Date(2026, 9, 28), new Date(2026, 10, 3), 'en-US')).toBe(
      'Oct 28 – Nov 3',
    );
  });

  it('shows years across a new year, and "From" for active trips', () => {
    expect(formatTripDateRange(new Date(2026, 11, 28), new Date(2027, 0, 3), 'en-US')).toBe(
      'Dec 28, 2026 – Jan 3, 2027',
    );
    expect(formatTripDateRange(new Date(2026, 9, 19), null, 'en-US')).toBe('From Oct 19');
  });
});

describe('trip month and day count', () => {
  it('formats month and counts both end days', () => {
    expect(formatTripMonth(new Date(2026, 1, 10), 'en-US')).toBe('Feb 2026');
    expect(tripDayCount(new Date(2026, 1, 10, 20), new Date(2026, 1, 17, 6))).toBe(8);
    expect(formatDayCount(1)).toBe('1 day');
  });
});

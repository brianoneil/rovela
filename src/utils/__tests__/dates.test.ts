import { splitIntoLocalDays, toLocalDateKey } from '../dates';

describe('toLocalDateKey', () => {
  it('formats the local calendar day', () => {
    expect(toLocalDateKey(new Date(2026, 1, 5, 23, 30))).toBe('2026-02-05');
  });
});

describe('splitIntoLocalDays', () => {
  it('clips the first and last day to the range', () => {
    const days = splitIntoLocalDays(new Date(2026, 1, 10, 15), new Date(2026, 1, 12, 9));
    expect(days.map((day) => toLocalDateKey(day.start))).toEqual([
      '2026-02-10',
      '2026-02-11',
      '2026-02-12',
    ]);
    expect(days[0]?.start).toEqual(new Date(2026, 1, 10, 15));
    expect(days[2]?.end).toEqual(new Date(2026, 1, 12, 9));
  });

  it('does not add an empty day when the range ends at midnight', () => {
    const days = splitIntoLocalDays(new Date(2026, 1, 10), new Date(2026, 1, 11));
    expect(days).toHaveLength(1);
  });

  it('returns nothing for an empty or reversed range', () => {
    expect(splitIntoLocalDays(new Date(2026, 1, 11), new Date(2026, 1, 10))).toEqual([]);
  });
});

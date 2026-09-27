import { getDayColor } from '../dayColor';
import { dayColors } from '../tokens';

describe('getDayColor', () => {
  it('returns the Paper day colors in order for days 1-5', () => {
    expect([1, 2, 3, 4, 5].map(getDayColor)).toEqual([...dayColors]);
  });

  it('repeats the sequence for days after 5', () => {
    expect(getDayColor(6)).toBe(dayColors[0]);
    expect(getDayColor(8)).toBe(dayColors[2]);
  });

  it('rejects day numbers that are not positive integers', () => {
    expect(() => getDayColor(0)).toThrow(RangeError);
    expect(() => getDayColor(1.5)).toThrow(RangeError);
  });
});

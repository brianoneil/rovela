import { withAlpha } from '../withAlpha';

describe('withAlpha', () => {
  it('converts a token color to rgba', () => {
    expect(withAlpha('#0E1318', 0.92)).toBe('rgba(14, 19, 24, 0.92)');
  });

  it('rejects colors that are not #RRGGBB', () => {
    expect(() => withAlpha('#FFF', 1)).toThrow(RangeError);
  });
});

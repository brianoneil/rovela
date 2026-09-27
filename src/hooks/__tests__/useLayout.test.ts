import { getLayout } from '../useLayout';

describe('getLayout', () => {
  it('treats an iPhone as phone in both orientations', () => {
    expect(getLayout(390, 844).formFactor).toBe('phone');

    const landscape = getLayout(844, 390);
    expect(landscape.formFactor).toBe('phone');
    expect(landscape.isLandscape).toBe(true);
  });

  it('treats iPad mini, Air, and Pro windows as tablet', () => {
    expect(getLayout(744, 1133).isTablet).toBe(true);
    expect(getLayout(820, 1180).isTablet).toBe(true);
    expect(getLayout(1194, 834).isTablet).toBe(true);
  });
});

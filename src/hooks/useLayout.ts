import { useWindowDimensions } from 'react-native';

export type FormFactor = 'phone' | 'tablet';

export interface Layout {
  width: number;
  height: number;
  formFactor: FormFactor;
  isTablet: boolean;
  isLandscape: boolean;
}

/**
 * Smallest window side (in points) that gets the tablet layout. 600 is Android's standard
 * tablet threshold (sw600dp) and includes every iPad, including the mini (744) and Air (820),
 * which are narrower than the 834 tablet artboard in Paper.
 * TODO: Add this as a breakpoint token in Paper so it lives with the other tokens.
 */
export const TABLET_MIN_SHORT_SIDE = 600;

/**
 * Classifies a window size. Uses window size (not device model), so iPad Split View and
 * Slide Over get the layout that fits the space they actually have. Using the shorter side
 * keeps a phone in landscape on the phone layout.
 */
export function getLayout(width: number, height: number): Layout {
  const isTablet = Math.min(width, height) >= TABLET_MIN_SHORT_SIDE;

  return {
    width,
    height,
    formFactor: isTablet ? 'tablet' : 'phone',
    isTablet,
    isLandscape: width > height,
  };
}

/** Current window layout for phone/tablet branching; updates on rotation and resizing. */
export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();
  return getLayout(width, height);
}

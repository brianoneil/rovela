import type { TextStyle } from 'react-native';

import { fontFamily } from './fonts';
import { colors, fontSize, lineHeight, trackingEm } from './tokens';

/** Converts a Paper em letter-spacing into React Native points for a given font size. */
export function tracking(em: number, size: number): number {
  return em * size;
}

/**
 * Text variants composed only from Paper tokens.
 * Serif carries narrative (titles, story, quotes); sans carries data (labels, stats, UI).
 * TODO: Verify each variant against the Paper screens with `get_computed_styles` when the
 * first screen that uses it is built, and add variants the designs need.
 */
export const textVariants = {
  display: {
    fontFamily: fontFamily.serifRegular,
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    letterSpacing: tracking(trackingEm.tight, fontSize.display),
    color: colors.text,
  },
  title: {
    fontFamily: fontFamily.serifRegular,
    fontSize: fontSize.title,
    letterSpacing: tracking(trackingEm.tight, fontSize.title),
    color: colors.text,
  },
  quote: {
    fontFamily: fontFamily.serifItalic,
    fontSize: fontSize.quote,
    lineHeight: lineHeight.quote,
    color: colors.text,
  },
  story: {
    fontFamily: fontFamily.serifRegular,
    fontSize: fontSize.lead,
    lineHeight: lineHeight.quote,
    color: colors.text,
  },
  body: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    color: colors.text,
  },
  caption: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
    color: colors.textMuted,
  },
  label: {
    fontFamily: fontFamily.sansSemibold,
    fontSize: fontSize.label,
    letterSpacing: tracking(trackingEm.caps, fontSize.label),
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;

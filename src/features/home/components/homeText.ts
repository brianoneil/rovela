import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, textVariants } from '@/theme';

/** Text styles shared by several Home components, with exact line heights from the Paper designs. */
export const homeText = StyleSheet.create({
  capsLabel: {
    ...textVariants.label,
    lineHeight: 14,
  },
  meta: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.caption,
    lineHeight: 16,
    color: colors.textMuted,
  },
  smallMeta: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.label,
    lineHeight: 14,
    color: colors.textMuted,
  },
});

import {
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_600SemiBold,
} from '@expo-google-fonts/inter-tight';
import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_500Medium,
} from '@expo-google-fonts/newsreader';

/**
 * React Native selects custom font weights by family name, not by `fontWeight`,
 * so every weight/style we load is registered under its own name.
 */
export const fontFamily = {
  serifRegular: 'Newsreader_400Regular',
  serifItalic: 'Newsreader_400Regular_Italic',
  serifMedium: 'Newsreader_500Medium',
  sansRegular: 'InterTight_400Regular',
  sansMedium: 'InterTight_500Medium',
  sansSemibold: 'InterTight_600SemiBold',
} as const;

export type FontFamilyName = (typeof fontFamily)[keyof typeof fontFamily];

/** Font assets passed to `useFonts` in the root layout. */
export const fontAssets: Record<FontFamilyName, number> = {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_500Medium,
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_600SemiBold,
};

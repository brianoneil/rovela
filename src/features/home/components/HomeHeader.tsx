import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize, tracking, trackingEm } from '@/theme';

import { StartTripPill } from './StartTripPill';

interface HomeHeaderProps {
  variant: 'phone' | 'tablet';
  onStartTrip: () => void;
}

/**
 * Wordmark row. Tablet puts the "Start a new trip" action here; phone uses the floating bar.
 * TODO: Add the profile avatar once the app has a profile (no profile data exists yet).
 */
export function HomeHeader({ variant, onStartTrip }: HomeHeaderProps) {
  const isTablet = variant === 'tablet';
  return (
    <View style={[styles.row, isTablet ? styles.tabletRow : styles.phoneRow]}>
      <Text accessibilityRole="header" style={isTablet ? styles.tabletTitle : styles.phoneTitle}>
        Rovela
      </Text>
      {isTablet ? <StartTripPill onPress={onStartTrip} /> : null}
    </View>
  );
}

const TABLET_TITLE_SIZE = 34;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabletRow: {
    paddingHorizontal: 40,
  },
  phoneTitle: {
    fontFamily: fontFamily.serifMedium,
    fontSize: fontSize.title,
    lineHeight: 34,
    letterSpacing: tracking(trackingEm.tight, fontSize.title),
    color: colors.text,
  },
  tabletTitle: {
    fontFamily: fontFamily.serifMedium,
    fontSize: TABLET_TITLE_SIZE,
    lineHeight: 42,
    letterSpacing: tracking(trackingEm.tight, TABLET_TITLE_SIZE),
    color: colors.text,
  },
});

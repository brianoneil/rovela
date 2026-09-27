import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StrokeIcon } from '@/components/icons/StrokeIcon';
import { colors, fontFamily, opacity, radius, textVariants, tracking, trackingEm } from '@/theme';

import type { UpcomingTrip } from '../upcomingTrip';
import { homeText } from './homeText';
import { upcomingSubtitle } from './upcomingSubtitle';

/** Phone: compact "Up next" row with a days-to-go badge. */
export function UpNextRow({ upcoming, onPress }: { upcoming: UpcomingTrip; onPress: () => void }) {
  const { trip, daysUntil } = upcoming;
  const subtitle = upcomingSubtitle(trip);
  const dayWord = daysUntil === 1 ? 'day' : 'days';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Up next: ${trip.name}, ${daysUntil} ${dayWord} to go, ${subtitle}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeNumber}>{daysUntil}</Text>
        <Text style={styles.badgeUnit}>{dayWord}</Text>
      </View>
      <View style={styles.texts}>
        <Text style={homeText.capsLabel}>Up next</Text>
        <Text style={styles.name} numberOfLines={1}>
          {trip.name}
        </Text>
        <Text style={homeText.meta} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <StrokeIcon name="chevronRight" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  pressed: {
    opacity: opacity.muted,
  },
  badge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.ground,
  },
  badgeNumber: {
    fontFamily: fontFamily.serifRegular,
    fontSize: 20,
    lineHeight: 22,
    color: colors.text,
  },
  badgeUnit: {
    ...textVariants.label,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: tracking(trackingEm.caps, 9),
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fontFamily.serifRegular,
    fontSize: 17,
    lineHeight: 22,
    color: colors.text,
  },
});

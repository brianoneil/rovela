import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fontFamily, fontSize, opacity } from '@/theme';

import type { UpcomingTrip } from '../upcomingTrip';
import { homeText } from './homeText';
import { upcomingSubtitle } from './upcomingSubtitle';

interface UpNextCardProps {
  upcoming: UpcomingTrip;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Tablet: "Up next" card with a large days-to-go count. */
export function UpNextCard({ upcoming, onPress, style }: UpNextCardProps) {
  const { trip, daysUntil } = upcoming;
  const subtitle = upcomingSubtitle(trip);
  const countLabel = daysUntil === 1 ? 'day to go' : 'days to go';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Up next: ${trip.name}, ${daysUntil} ${countLabel}, ${subtitle}`}
      style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
    >
      <Text style={homeText.capsLabel}>Up next</Text>
      <View style={styles.details}>
        <View style={styles.count}>
          <Text style={styles.countNumber}>{daysUntil}</Text>
          <Text style={homeText.meta}>{countLabel}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {trip.name}
        </Text>
        <Text style={homeText.meta} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 20,
  },
  pressed: {
    opacity: opacity.muted,
  },
  details: {
    gap: 4,
  },
  count: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  countNumber: {
    fontFamily: fontFamily.serifRegular,
    fontSize: 56,
    lineHeight: 56,
    color: colors.text,
  },
  name: {
    fontFamily: fontFamily.serifRegular,
    fontSize: fontSize.quote,
    lineHeight: 24,
    color: colors.text,
  },
});

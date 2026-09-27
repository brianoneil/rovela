import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RouteThumbnail } from '@/components/RouteThumbnail';
import { useTripRoute } from '@/features/trips/useTripRoute';
import { colors, fontFamily, fontSize, lineHeight, opacity } from '@/theme';
import type { Trip } from '@/types';
import { formatDayCount, formatTripMonth, tripDayCount } from '@/utils/formatTrip';

import { homeText } from './homeText';

interface TripCardProps {
  trip: Trip;
  variant: 'phone' | 'tablet';
  width: number;
  onPress: () => void;
}

const VARIANTS = {
  phone: { tileHeight: 110, strokeWidth: 2.5, nameSize: fontSize.body, nameLine: 18 },
  tablet: { tileHeight: 150, strokeWidth: 3, nameSize: fontSize.lead, nameLine: lineHeight.body },
} as const;

/** "Feb 2026 · 8 days · Patagonia". Tablet adds the first destination; active trips say so. */
function tripMeta(trip: Trip, withDestination: boolean): string {
  const parts = [formatTripMonth(trip.startAt)];
  parts.push(trip.endAt ? formatDayCount(tripDayCount(trip.startAt, trip.endAt)) : 'In progress');
  const destination = trip.destinations[0];
  if (withDestination && destination) {
    parts.push(destination);
  }
  return parts.join(' · ');
}

/** Trip in the "Your trips" list: route thumbnail in day colors, name, and meta line. */
export function TripCard({ trip, variant, width, onPress }: TripCardProps) {
  const v = VARIANTS[variant];
  const { route } = useTripRoute(trip);
  const meta = tripMeta(trip, variant === 'tablet');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${trip.name}, ${meta}`}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
    >
      <RouteThumbnail route={route} strokeWidth={v.strokeWidth} style={{ height: v.tileHeight }} />
      <View>
        <Text
          style={[styles.name, { fontSize: v.nameSize, lineHeight: v.nameLine }]}
          numberOfLines={1}
        >
          {trip.name}
        </Text>
        <Text style={homeText.smallMeta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  pressed: {
    opacity: opacity.muted,
  },
  name: {
    fontFamily: fontFamily.serifRegular,
    color: colors.text,
  },
});

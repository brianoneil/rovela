import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fontFamily } from '@/theme';

import { homeText } from './homeText';

interface LifetimeStatsCardProps {
  tripCount: number;
  /** Null when no walking, running, or hiking distance has been imported. */
  footDistanceKm: number | null;
  direction: 'row' | 'column';
  style?: StyleProp<ViewStyle>;
}

/**
 * Tablet: lifetime totals. Only shows numbers backed by data.
 * TODO: Add Countries once places are reverse geocoded.
 */
export function LifetimeStatsCard({
  tripCount,
  footDistanceKm,
  direction,
  style,
}: LifetimeStatsCardProps) {
  const stats = [{ value: tripCount.toLocaleString(), label: tripCount === 1 ? 'Trip' : 'Trips' }];
  if (footDistanceKm !== null) {
    stats.push({
      value: `${footDistanceKm.toLocaleString(undefined, { maximumFractionDigits: 0 })} km`,
      label: 'On foot',
    });
  }

  return (
    <View
      style={[styles.card, direction === 'row' ? styles.row : styles.column, style]}
      accessible
      accessibilityLabel={stats.map((stat) => `${stat.value} ${stat.label}`).join(', ')}
    >
      {stats.map((stat) => (
        <View key={stat.label}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={homeText.smallMeta}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    justifyContent: 'space-between',
  },
  value: {
    fontFamily: fontFamily.serifRegular,
    fontSize: 22,
    lineHeight: 28,
    color: colors.text,
  },
});

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { UpcomingTrip } from '../upcomingTrip';
import { LifetimeStatsCard } from './LifetimeStatsCard';
import { UpNextCard } from './UpNextCard';

interface TabletSummaryRowProps {
  upcoming: UpcomingTrip | null;
  tripCount: number;
  footDistanceKm: number | null;
  onOpenUpcoming: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Tablet: "Up next" beside a 240 pt stats column (iPad portrait design). Without an upcoming trip
 * the stats card spans the row on its own.
 */
export function TabletSummaryRow({
  upcoming,
  tripCount,
  footDistanceKm,
  onOpenUpcoming,
  style,
}: TabletSummaryRowProps) {
  if (!upcoming) {
    return (
      <LifetimeStatsCard
        tripCount={tripCount}
        footDistanceKm={footDistanceKm}
        direction="row"
        style={style}
      />
    );
  }

  return (
    <View style={[styles.row, style]}>
      <UpNextCard upcoming={upcoming} onPress={onOpenUpcoming} style={styles.upNext} />
      <LifetimeStatsCard
        tripCount={tripCount}
        footDistanceKm={footDistanceKm}
        direction="column"
        style={styles.stats}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
    height: 200,
  },
  upNext: {
    flex: 1,
  },
  stats: {
    width: 240,
  },
});

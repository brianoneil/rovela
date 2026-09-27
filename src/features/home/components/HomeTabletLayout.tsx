import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme';

import { HomeHeader } from './HomeHeader';
import type { HomeActions, HomeContent } from './homeLayoutTypes';
import { LifetimeStatsCard } from './LifetimeStatsCard';
import { MemoryHero } from './MemoryHero';
import { RebuildTripTile } from './RebuildTripTile';
import { SectionHeader } from './SectionHeader';
import { TabletSummaryRow } from './TabletSummaryRow';
import { TripCard } from './TripCard';
import { UpNextCard } from './UpNextCard';

interface HomeTabletLayoutProps {
  content: HomeContent;
  actions: HomeActions;
  width: number;
  isLandscape: boolean;
}

const HORIZONTAL_PADDING = 40;
const GRID_GAP = 16;
// The status bar overlaps the design's 40 pt header padding.
const HEADER_GAP_BELOW_STATUS_BAR = 16;

/**
 * Tablet Home. Landscape puts the memory hero beside "Up next" and stats; portrait stacks the hero
 * above them. Trips fill a grid (4 columns landscape, 2 portrait) ending with the rebuild tile.
 */
export function HomeTabletLayout({ content, actions, width, isLandscape }: HomeTabletLayoutProps) {
  const insets = useSafeAreaInsets();
  const { trips, memory, memoryDetails, upcoming, footDistanceKm } = content;

  const columns = isLandscape ? 4 : 2;
  const gridWidth = width - HORIZONTAL_PADDING * 2 - insets.left - insets.right;
  const cardWidth = (gridWidth - GRID_GAP * (columns - 1)) / columns;
  const hero = memory && memoryDetails ? { memory, details: memoryDetails } : null;
  const openUpcoming = () => {
    if (upcoming) actions.openTrip(upcoming.trip);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top + HEADER_GAP_BELOW_STATUS_BAR,
        paddingBottom: insets.bottom + spacing[6],
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <HomeHeader variant="tablet" onStartTrip={actions.startTrip} />

      {hero && isLandscape ? (
        <View style={styles.landscapeTop}>
          <MemoryHero
            memory={hero.memory}
            details={hero.details}
            variant="tablet"
            onPress={() => actions.openMemory(hero.memory)}
            style={styles.landscapeHero}
          />
          <View style={styles.sideColumn}>
            {upcoming ? (
              <UpNextCard upcoming={upcoming} onPress={openUpcoming} style={styles.fill} />
            ) : null}
            <LifetimeStatsCard
              tripCount={trips.length}
              footDistanceKm={footDistanceKm}
              direction={upcoming ? 'row' : 'column'}
              style={upcoming ? null : styles.fill}
            />
          </View>
        </View>
      ) : (
        <View style={styles.stackedTop}>
          {hero ? (
            <MemoryHero
              memory={hero.memory}
              details={hero.details}
              variant="tablet"
              onPress={() => actions.openMemory(hero.memory)}
              style={styles.portraitHero}
            />
          ) : null}
          {/* TODO: Replace with the approved empty-state design when there are no trips. */}
          {trips.length > 0 ? (
            <TabletSummaryRow
              upcoming={upcoming}
              tripCount={trips.length}
              footDistanceKm={footDistanceKm}
              onOpenUpcoming={openUpcoming}
            />
          ) : null}
        </View>
      )}

      {trips.length > 0 ? (
        <View style={styles.tripsSection}>
          <SectionHeader title="Your trips" />
          <View style={styles.grid}>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                variant="tablet"
                width={cardWidth}
                onPress={() => actions.openTrip(trip)}
              />
            ))}
            <RebuildTripTile width={cardWidth} onPress={actions.rebuildTrip} />
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  landscapeTop: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 24,
    paddingHorizontal: HORIZONTAL_PADDING,
    height: 24 + 400,
  },
  // 700 : 394 is the hero-to-side-column split on the 1194 pt landscape artboard.
  landscapeHero: {
    flex: 700,
  },
  sideColumn: {
    flex: 394,
    gap: 20,
  },
  fill: {
    flex: 1,
  },
  stackedTop: {
    gap: 16,
    paddingTop: 20,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  portraitHero: {
    height: 380,
  },
  tripsSection: {
    gap: 12,
    paddingTop: 28,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: GRID_GAP,
    rowGap: 20,
  },
});

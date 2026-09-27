import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme';

import { HomeHeader } from './HomeHeader';
import type { HomeActions, HomeContent } from './homeLayoutTypes';
import { MemoryHero } from './MemoryHero';
import { SectionHeader } from './SectionHeader';
import { StartTripBar } from './StartTripBar';
import { TripCard } from './TripCard';
import { UpNextRow } from './UpNextRow';

const HORIZONTAL_PADDING = 20;
const TRIP_CARD_WIDTH = 160;
// 48 pt button + 8 pt padding on each side + 1 pt borders.
const START_BAR_HEIGHT = 66;

/** Phone Home: single scrolling column with the floating "Start a new trip" bar. */
export function HomePhoneLayout({
  content,
  actions,
}: {
  content: HomeContent;
  actions: HomeActions;
}) {
  const insets = useSafeAreaInsets();
  const { trips, memory, memoryDetails, upcoming } = content;
  const barBottom = Math.max(insets.bottom, spacing[5]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: barBottom + START_BAR_HEIGHT + spacing[5],
        }}
      >
        <HomeHeader variant="phone" onStartTrip={actions.startTrip} />
        <View style={styles.feed}>
          {memory && memoryDetails ? (
            <MemoryHero
              memory={memory}
              details={memoryDetails}
              variant="phone"
              onPress={() => actions.openMemory(memory)}
              style={styles.hero}
            />
          ) : null}
          {upcoming ? (
            <UpNextRow upcoming={upcoming} onPress={() => actions.openTrip(upcoming.trip)} />
          ) : null}
          {/* TODO: Replace with the approved empty-state design when there are no trips. */}
          {trips.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader title="Your trips" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tripScroller}
                contentContainerStyle={styles.tripRow}
              >
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    variant="phone"
                    width={TRIP_CARD_WIDTH}
                    onPress={() => actions.openTrip(trip)}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <StartTripBar onPress={actions.startTrip} bottom={barBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  feed: {
    gap: 24,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 16,
  },
  hero: {
    height: 300,
  },
  section: {
    gap: 12,
  },
  // Lets the trip row scroll edge to edge while its first card lines up with the feed.
  tripScroller: {
    marginHorizontal: -HORIZONTAL_PADDING,
  },
  tripRow: {
    gap: 10,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
});

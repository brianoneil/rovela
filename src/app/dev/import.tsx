import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DevButton } from '@/features/dev/DevButton';
import { DevPermissionRow } from '@/features/dev/DevPermissionRow';
import { DevTripPanel } from '@/features/dev/DevTripPanel';
import { useCreateTrip, useTrips } from '@/features/trips/useTrips';
import { IMPORT_SOURCES } from '@/services/import/types';
import { colors, spacing } from '@/theme';

const DEV_TRIP_DAYS = 30;

/**
 * Developer-only harness for the Phase 2 data layer: permissions, trips, and retroactive import.
 * TODO: Remove once the designed Create Trip and Import screens exist in Paper and are built.
 */
export default function DevImportScreen() {
  const trips = useTrips();
  const createTrip = useCreateTrip();

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  const createRecentTrip = () => {
    const endAt = new Date();
    const startAt = new Date(endAt);
    startAt.setDate(startAt.getDate() - DEV_TRIP_DAYS);
    createTrip.mutate({ name: `Last ${DEV_TRIP_DAYS} days`, startAt, endAt });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="label">Developer</AppText>
        <AppText variant="title">Import harness</AppText>

        <AppText variant="label">Permissions</AppText>
        {IMPORT_SOURCES.map((source) => (
          <DevPermissionRow key={source} source={source} />
        ))}

        <AppText variant="label">Trips</AppText>
        <View style={styles.row}>
          <DevButton
            label={`New trip: last ${DEV_TRIP_DAYS} days`}
            onPress={createRecentTrip}
            disabled={createTrip.isPending}
          />
        </View>
        {createTrip.error ? (
          <AppText variant="caption">Create error: {createTrip.error.userMessage}</AppText>
        ) : null}
        {trips.error ? (
          <AppText variant="caption">Trips error: {trips.error.userMessage}</AppText>
        ) : null}
        {trips.data?.length === 0 ? <AppText variant="caption">No trips yet.</AppText> : null}
        {trips.data?.map((trip) => (
          <DevTripPanel key={trip.id} trip={trip} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.ground,
  },
  content: {
    gap: spacing[3],
    padding: spacing[5],
  },
  row: {
    flexDirection: 'row',
  },
});

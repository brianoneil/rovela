import { Link, useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/AppText';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

/** TODO: Build Create Trip (start now / rebuild a past trip) once its Paper design is approved. */
export default function CreateTripScreen() {
  const { mode } = useLocalSearchParams<{ mode?: 'rebuild' }>();
  const isRebuild = mode === 'rebuild';

  return (
    <PlaceholderScreen
      title={isRebuild ? 'Rebuild a past trip' : 'Start a new trip'}
      description={
        isRebuild
          ? 'Pick the dates; Rovela finds photos, workouts, and calendar events from that time.'
          : 'Name the trip and start capturing.'
      }
    >
      {/* TODO: Remove once Create Trip is built; the harness exercises the import pipeline. */}
      {__DEV__ ? (
        <Link href="/dev/import">
          <AppText>Import harness (dev)</AppText>
        </Link>
      ) : null}
    </PlaceholderScreen>
  );
}

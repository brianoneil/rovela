import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/PlaceholderScreen';

/** TODO: Build Trip Cover from the approved Paper design (phone + iPad). */
export default function TripCoverScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  return (
    <PlaceholderScreen
      title="Trip Cover"
      description={`Hero photo, title, stats, and route trace for trip ${tripId}.`}
    />
  );
}

import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/PlaceholderScreen';

/** TODO: Build Day View from the approved Paper design (phone + iPad split view). */
export default function DayViewScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  return (
    <PlaceholderScreen
      title="Day View"
      description={`Map, weather ribbon, photos, activity, places, and notes for ${date}.`}
    />
  );
}

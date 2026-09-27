import { Stack } from 'expo-router';

/**
 * Screens inside one trip. On tablet, Chronicle and Day View sit beside a persistent map.
 * TODO: Add the tablet split-view shell once those screens are built.
 */
export default function TripLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="chronicle" />
      <Stack.Screen name="map" />
      <Stack.Screen name="day/[date]" />
      <Stack.Screen name="story" />
    </Stack>
  );
}

import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorState } from '@/components/ErrorState';
import { DatabaseGate } from '@/db/DatabaseGate';
import { logger } from '@/services/logger';
import { queryClient } from '@/services/queryClient';
import { colors, fontAssets } from '@/theme';

export { AppErrorBoundary as ErrorBoundary } from '@/components/AppErrorBoundary';

SplashScreen.preventAutoHideAsync().catch((error: unknown) => {
  logger.warn('Could not keep the splash screen visible', error);
});

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.ground,
    card: colors.ground,
    border: colors.line,
    text: colors.text,
    primary: colors.accent,
  },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const [databaseSettled, setDatabaseSettled] = useState(false);
  const handleDatabaseSettled = useCallback(() => setDatabaseSettled(true), []);

  const fontsSettled = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (fontError) {
      logger.error('Fonts failed to load', fontError);
    }
  }, [fontError]);

  // Hide the native splash once fonts and the database are both ready, or as soon as fonts fail
  // (the database gate is not mounted in that case, so the font error screen must show).
  const readyToShow = fontsSettled && (databaseSettled || fontError !== null);

  useEffect(() => {
    if (readyToShow) {
      SplashScreen.hideAsync().catch((error: unknown) => {
        logger.warn('Could not hide the splash screen', error);
      });
    }
  }, [readyToShow]);

  if (!fontsSettled) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.ground }}>
      <ThemeProvider value={navigationTheme}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          {fontError ? (
            <ErrorState
              title="Couldn’t load Rovela"
              message="Some app resources failed to load. Restart the app to try again."
            />
          ) : (
            <DatabaseGate onSettled={handleDatabaseSettled}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
                <Stack.Screen name="trip/[tripId]" />
                <Stack.Screen name="capture" options={{ presentation: 'formSheet' }} />
                <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
              </Stack>
            </DatabaseGate>
          )}
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

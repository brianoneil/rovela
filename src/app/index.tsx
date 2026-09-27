import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { ErrorState } from '@/components/ErrorState';
import { HomePhoneLayout } from '@/features/home/components/HomePhoneLayout';
import type { HomeActions } from '@/features/home/components/homeLayoutTypes';
import { HomeTabletLayout } from '@/features/home/components/HomeTabletLayout';
import { useHomeData, useMemoryDetails } from '@/features/home/useHomeData';
import { useLayout } from '@/hooks/useLayout';

export default function HomeScreen() {
  const router = useRouter();
  const layout = useLayout();
  const { trips, memory, upcoming, footDistanceKm } = useHomeData();
  const memoryDetails = useMemoryDetails(memory);

  const actions = useMemo<HomeActions>(
    () => ({
      startTrip: () => router.push('/create-trip'),
      rebuildTrip: () => router.push({ pathname: '/create-trip', params: { mode: 'rebuild' } }),
      openTrip: (trip) => router.push({ pathname: '/trip/[tripId]', params: { tripId: trip.id } }),
      openMemory: (tripMemory) =>
        router.push({
          pathname: '/trip/[tripId]/day/[date]',
          params: { tripId: tripMemory.trip.id, date: tripMemory.date },
        }),
    }),
    [router],
  );

  if (trips.isError) {
    return (
      <ErrorState
        title="Couldn’t load your trips"
        message={trips.error.message}
        actionLabel="Try again"
        onAction={() => void trips.refetch()}
      />
    );
  }

  // Local SQLite reads are near-instant; render nothing rather than flash a spinner.
  if (!trips.data) {
    return null;
  }

  const content = {
    trips: trips.data,
    memory,
    memoryDetails,
    upcoming,
    footDistanceKm,
  };

  return layout.isTablet ? (
    <HomeTabletLayout
      content={content}
      actions={actions}
      width={layout.width}
      isLandscape={layout.isLandscape}
    />
  ) : (
    <HomePhoneLayout content={content} actions={actions} />
  );
}

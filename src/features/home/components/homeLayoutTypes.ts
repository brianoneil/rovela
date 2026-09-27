import type { Trip } from '@/types';

import type { TripMemory } from '../tripMemory';
import type { UpcomingTrip } from '../upcomingTrip';
import type { MemoryDetails } from '../useHomeData';

/** Data both Home layouts render. */
export interface HomeContent {
  trips: Trip[];
  memory: TripMemory | null;
  /** Null until the anniversary day's photos are loaded; the hero waits for it. */
  memoryDetails: MemoryDetails | null;
  upcoming: UpcomingTrip | null;
  footDistanceKm: number | null;
}

export interface HomeActions {
  startTrip: () => void;
  rebuildTrip: () => void;
  openTrip: (trip: Trip) => void;
  openMemory: (memory: TripMemory) => void;
}

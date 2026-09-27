import type { TimelineEntry, Trip } from '@/types';

import { sumFootDistanceKm } from '../footDistance';
import { findTripMemory, pickDayPhotoAssetId, photosOnDay } from '../tripMemory';
import { findUpcomingTrip } from '../upcomingTrip';

function trip(id: string, start: Date, end: Date | null): Trip {
  return {
    id,
    name: id,
    startAt: start,
    endAt: end,
    homeGeofence: null,
    destinations: [],
    coverImageRef: null,
    tags: [],
    createdAt: start,
    updatedAt: start,
  };
}

function entry(partial: Partial<TimelineEntry>): TimelineEntry {
  return {
    id: 'e',
    tripId: 't',
    timestamp: new Date(2025, 8, 10, 12),
    durationMs: null,
    type: 'photo',
    source: 'automatic',
    externalId: null,
    location: null,
    payload: {},
    createdAt: new Date(),
    ...partial,
  };
}

describe('findTripMemory', () => {
  const today = new Date(2026, 8, 12, 9);

  it('finds a trip from an earlier year covering today and its day number', () => {
    const memory = findTripMemory(
      [trip('dolomites', new Date(2025, 8, 9, 8), new Date(2025, 8, 14, 18))],
      today,
    );
    expect(memory?.trip.id).toBe('dolomites');
    expect(memory?.yearsAgo).toBe(1);
    expect(memory?.date).toBe('2025-09-12');
    expect(memory?.dayNumber).toBe(4);
  });

  it('ignores this year, active trips, and trips not covering today', () => {
    expect(
      findTripMemory(
        [
          trip('now', new Date(2026, 8, 10), new Date(2026, 8, 13)),
          trip('active', new Date(2024, 8, 10), null),
          trip('other', new Date(2025, 5, 1), new Date(2025, 5, 5)),
        ],
        today,
      ),
    ).toBeNull();
  });

  it('prefers the most recent year', () => {
    const memory = findTripMemory(
      [
        trip('old', new Date(2022, 8, 11), new Date(2022, 8, 13)),
        trip('recent', new Date(2024, 8, 11), new Date(2024, 8, 13)),
      ],
      today,
    );
    expect(memory?.trip.id).toBe('recent');
    expect(memory?.yearsAgo).toBe(2);
  });
});

describe('day photo selection', () => {
  it('prefers a favorite on the requested day', () => {
    const photos = photosOnDay(
      [
        entry({ payload: { assetId: 'a' } }),
        entry({ payload: { assetId: 'b', isFavorite: true } }),
        entry({ payload: { assetId: 'c' }, timestamp: new Date(2025, 8, 11) }),
      ],
      '2025-09-10',
    );
    expect(photos).toHaveLength(2);
    expect(pickDayPhotoAssetId(photos)).toBe('b');
    expect(pickDayPhotoAssetId([])).toBeNull();
  });
});

describe('findUpcomingTrip', () => {
  it('returns the soonest future trip with days until it starts', () => {
    const now = new Date(2026, 8, 26, 20);
    const result = findUpcomingTrip(
      [
        trip('later', new Date(2026, 11, 1), null),
        trip('soon', new Date(2026, 9, 19, 7), new Date(2026, 9, 30)),
        trip('past', new Date(2026, 1, 1), new Date(2026, 1, 8)),
      ],
      now,
    );
    expect(result?.trip.id).toBe('soon');
    expect(result?.daysUntil).toBe(23);
  });
});

describe('sumFootDistanceKm', () => {
  it('adds walking, running, and hiking distances across units', () => {
    const km = sumFootDistanceKm([
      entry({
        type: 'workout',
        payload: { activityType: 'hiking', totalDistance: { quantity: 12000, unit: 'm' } },
      }),
      entry({
        type: 'workout',
        payload: { activityType: 'RUNNING', totalDistance: { quantity: 1, unit: 'mi' } },
      }),
      entry({
        type: 'workout',
        payload: { activityType: 'cycling', totalDistance: { quantity: 40, unit: 'km' } },
      }),
    ]);
    expect(km).toBeCloseTo(13.609344);
  });

  it('returns null when no foot workout has a distance', () => {
    expect(
      sumFootDistanceKm([entry({ type: 'workout', payload: { activityType: 'walking' } })]),
    ).toBeNull();
  });
});

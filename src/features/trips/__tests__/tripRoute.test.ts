import type { TimelineEntry } from '@/types';

import { buildTripRoute, projectRoute } from '../tripRoute';

const start = new Date(2026, 1, 10, 8);

function located(lat: number, lng: number, when: Date): TimelineEntry {
  return {
    id: `${lat},${lng}`,
    tripId: 't',
    timestamp: when,
    durationMs: null,
    type: 'photo',
    source: 'automatic',
    externalId: null,
    location: { lat, lng },
    payload: {},
    createdAt: when,
  };
}

describe('buildTripRoute', () => {
  it('orders points by time, expands workout routes, and assigns trip days', () => {
    const workout: TimelineEntry = {
      ...located(0, 0, new Date(2026, 1, 11, 9)),
      type: 'workout',
      location: null,
      payload: {
        route: [
          { lat: -49.3, lng: -72.9, timestamp: new Date(2026, 1, 11, 9).getTime() },
          { lat: -49.2, lng: -72.95, timestamp: new Date(2026, 1, 11, 10).getTime() },
        ],
      },
    };
    const route = buildTripRoute(
      [located(-49.33, -72.88, new Date(2026, 1, 12, 15)), workout, located(-49.4, -72.8, start)],
      start,
    );
    expect(route.map((p) => p.day)).toEqual([1, 2, 2, 3]);
    expect(route[1]?.lat).toBe(-49.3);
  });
});

describe('projectRoute', () => {
  const route = [
    { lat: 0, lng: 0, timestamp: 1, day: 1 },
    { lat: 1, lng: 1, timestamp: 2, day: 1 },
    { lat: 1, lng: 2, timestamp: 3, day: 2 },
  ];

  it('splits by day and joins consecutive days', () => {
    const segments = projectRoute(route, 200, 100, 10);
    expect(segments.map((s) => s.day)).toEqual([1, 2]);
    expect(segments[1]?.points[0]).toEqual(segments[0]?.points[1]);
  });

  it('keeps every point inside the padded box with north up', () => {
    const points = projectRoute(route, 200, 100, 10).flatMap((s) => s.points);
    for (const point of points) {
      expect(point.x).toBeGreaterThanOrEqual(10 - 1e-9);
      expect(point.x).toBeLessThanOrEqual(190 + 1e-9);
      expect(point.y).toBeGreaterThanOrEqual(10 - 1e-9);
      expect(point.y).toBeLessThanOrEqual(90 + 1e-9);
    }
    expect(points[0]!.y).toBeGreaterThan(points[1]!.y);
  });

  it('draws nothing for a single position', () => {
    expect(projectRoute([route[0]!, { ...route[0]!, timestamp: 5 }], 200, 100, 10)).toEqual([]);
  });
});

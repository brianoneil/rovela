import type { TimelineEntry } from '@/types';
import { localDaysBetween } from '@/utils/dates';

export interface TripRoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
  /** 1-based trip day, used to pick the day color. */
  day: number;
}

export interface RouteSegment {
  day: number;
  /** Screen coordinates in the target box. */
  points: { x: number; y: number }[];
}

// Keeps thumbnails cheap to draw even for long GPS tracks.
const MAX_POINTS = 400;

/**
 * Collects every known position of a trip in time order: full workout routes when a workout has
 * one, otherwise the entry's own location (photos, events with coordinates, ...).
 */
export function buildTripRoute(entries: TimelineEntry[], tripStart: Date): TripRoutePoint[] {
  const points: Omit<TripRoutePoint, 'day'>[] = [];
  for (const entry of entries) {
    const route = readRoute(entry.payload.route);
    if (route.length > 0) {
      points.push(...route);
    } else if (entry.location) {
      points.push({
        lat: entry.location.lat,
        lng: entry.location.lng,
        timestamp: entry.timestamp.getTime(),
      });
    }
  }
  points.sort((a, b) => a.timestamp - b.timestamp);
  return points.map((point) => ({
    ...point,
    day: Math.max(1, localDaysBetween(tripStart, new Date(point.timestamp)) + 1),
  }));
}

/**
 * Fits a route into a width × height box and splits it into one segment per trip day.
 *
 * How it works:
 * 1. Longitude is scaled by cos(middle latitude) so the shape isn't stretched sideways away from
 *    the equator (a simple equirectangular projection — plenty for a thumbnail).
 * 2. The route is scaled uniformly to fit inside the padded box and centered, so it keeps its
 *    real proportions. North is up.
 * 3. A new segment starts whenever the day changes; the segment repeats the previous point so
 *    consecutive days join without a gap.
 * Returns an empty list when there aren't two distinct positions to draw a line between.
 */
export function projectRoute(
  route: TripRoutePoint[],
  width: number,
  height: number,
  padding: number,
): RouteSegment[] {
  const points = downsample(route);
  if (points.length < 2 || width <= 2 * padding || height <= 2 * padding) {
    return [];
  }

  const lats = points.map((p) => p.lat);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const lngScale = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const xs = points.map((p) => p.lng * lngScale);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const spanX = maxX - minX;
  const spanY = maxLat - minLat;
  if (spanX === 0 && spanY === 0) {
    return [];
  }

  const innerW = width - 2 * padding;
  const innerH = height - 2 * padding;
  const scale = Math.min(
    spanX > 0 ? innerW / spanX : Infinity,
    spanY > 0 ? innerH / spanY : Infinity,
  );
  const offsetX = padding + (innerW - spanX * scale) / 2;
  const offsetY = padding + (innerH - spanY * scale) / 2;

  const segments: RouteSegment[] = [];
  points.forEach((point, index) => {
    const screen = {
      x: offsetX + ((xs[index] ?? 0) - minX) * scale,
      y: offsetY + (maxLat - point.lat) * scale,
    };
    const current = segments[segments.length - 1];
    if (current && current.day === point.day) {
      current.points.push(screen);
    } else {
      const joinFrom = current?.points[current.points.length - 1];
      segments.push({ day: point.day, points: joinFrom ? [joinFrom, screen] : [screen] });
    }
  });
  return segments.filter((segment) => segment.points.length > 1);
}

/** Keeps every n-th point (and always the last) once a route exceeds MAX_POINTS. */
function downsample(route: TripRoutePoint[]): TripRoutePoint[] {
  if (route.length <= MAX_POINTS) {
    return route;
  }
  const step = Math.ceil(route.length / MAX_POINTS);
  const result = route.filter((_, index) => index % step === 0);
  const last = route[route.length - 1];
  if (last && result[result.length - 1] !== last) {
    result.push(last);
  }
  return result;
}

function readRoute(value: unknown): Omit<TripRoutePoint, 'day'>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const points: Omit<TripRoutePoint, 'day'>[] = [];
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue;
    const { lat, lng, timestamp } = item as Record<string, unknown>;
    if (typeof lat === 'number' && typeof lng === 'number' && typeof timestamp === 'number') {
      points.push({ lat, lng, timestamp });
    }
  }
  return points;
}

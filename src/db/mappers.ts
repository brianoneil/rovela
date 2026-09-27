import type { DailyActivity, GeoPoint, TimelineEntry, Trip } from '@/types';

import type { dailyActivity, timelineEntries, trips } from './schema';

type TripRow = typeof trips.$inferSelect;
type TimelineEntryRow = typeof timelineEntries.$inferSelect;
export type TimelineEntryInsert = typeof timelineEntries.$inferInsert;
type DailyActivityRow = typeof dailyActivity.$inferSelect;

export function toTrip(row: TripRow): Trip {
  return {
    id: row.id,
    name: row.name,
    startAt: row.startAt,
    endAt: row.endAt,
    homeGeofence: row.homeGeofence ?? null,
    destinations: row.destinations,
    coverImageRef: row.coverImageRef,
    tags: row.tags,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toTimelineEntry(row: TimelineEntryRow): TimelineEntry {
  return {
    id: row.id,
    tripId: row.tripId,
    timestamp: row.timestamp,
    durationMs: row.durationMs,
    type: row.type,
    source: row.source,
    externalId: row.externalId,
    location: toGeoPoint(row),
    payload: row.payload,
    createdAt: row.createdAt,
  };
}

/** Flattens a domain entry's location into the table's nullable columns. */
export function toTimelineEntryInsert(entry: TimelineEntry): TimelineEntryInsert {
  return {
    id: entry.id,
    tripId: entry.tripId,
    timestamp: entry.timestamp,
    durationMs: entry.durationMs,
    type: entry.type,
    source: entry.source,
    externalId: entry.externalId,
    lat: entry.location?.lat ?? null,
    lng: entry.location?.lng ?? null,
    altitude: entry.location?.altitude ?? null,
    accuracy: entry.location?.accuracy ?? null,
    payload: entry.payload,
    createdAt: entry.createdAt,
  };
}

export function toDailyActivity(row: DailyActivityRow): DailyActivity {
  return {
    tripId: row.tripId,
    date: row.date,
    steps: row.steps,
    source: row.source,
    updatedAt: row.updatedAt,
  };
}

/** A location only exists when both coordinates were recorded. */
function toGeoPoint(row: TimelineEntryRow): GeoPoint | null {
  if (row.lat === null || row.lng === null) {
    return null;
  }
  const point: GeoPoint = { lat: row.lat, lng: row.lng };
  if (row.altitude !== null) {
    point.altitude = row.altitude;
  }
  if (row.accuracy !== null) {
    point.accuracy = row.accuracy;
  }
  return point;
}

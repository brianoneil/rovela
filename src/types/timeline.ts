import type { GeoPoint } from './geo';

export const TIMELINE_ENTRY_TYPES = [
  'location',
  'photo',
  'video',
  'workout',
  'flight',
  'transit',
  'car_trip',
  'note',
  'voice_memo',
  'conversation',
  'place',
  'event',
  'milestone',
  'weather',
  'expense',
  'person_met',
] as const;

export type TimelineEntryType = (typeof TIMELINE_ENTRY_TYPES)[number];

export const ENTRY_SOURCES = ['automatic', 'manual'] as const;

export type EntrySource = (typeof ENTRY_SOURCES)[number];

/**
 * Type-specific data for an entry.
 * TODO: Replace with a discriminated union of typed payloads per TimelineEntryType as each
 * capture source is built.
 */
export type TimelineEntryPayload = Record<string, unknown>;

export interface TimelineEntry {
  id: string;
  tripId: string;
  timestamp: Date;
  durationMs: number | null;
  type: TimelineEntryType;
  source: EntrySource;
  /**
   * Identifies the record this entry was imported from (e.g. `media:<assetId>`), so re-running an
   * import never creates duplicates. Null for manual entries.
   */
  externalId: string | null;
  location: GeoPoint | null;
  payload: TimelineEntryPayload;
  createdAt: Date;
}

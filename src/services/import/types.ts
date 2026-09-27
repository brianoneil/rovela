import type { ServiceError } from '@/services/errors';
import type { DailyActivity, TimelineEntry } from '@/types';

/** Inclusive time window to import. */
export interface ImportRange {
  start: Date;
  end: Date;
}

/**
 * A timeline entry read from a platform source, before it is attached to a trip.
 * `externalId` is required so the same record is never imported twice.
 */
export type ImportedEntry = Omit<TimelineEntry, 'id' | 'tripId' | 'createdAt' | 'externalId'> & {
  externalId: string;
};

/** Daily step total before it is attached to a trip. */
export type ImportedDailyActivity = Omit<DailyActivity, 'tripId' | 'updatedAt'>;

export const IMPORT_SOURCES = ['photos', 'health', 'calendar'] as const;

export type ImportSource = (typeof IMPORT_SOURCES)[number];

/** What happened for one source. Permission denial and missing platforms are normal outcomes. */
export type ImportSourceOutcome =
  | { source: ImportSource; status: 'imported'; found: number; added: number; skipped: number }
  | { source: ImportSource; status: 'permission_denied' }
  | { source: ImportSource; status: 'unavailable' }
  | { source: ImportSource; status: 'failed'; error: ServiceError };

export interface TripImportSummary {
  tripId: string;
  range: ImportRange;
  outcomes: ImportSourceOutcome[];
}

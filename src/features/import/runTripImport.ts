import { randomUUID } from 'expo-crypto';

import { insertTimelineEntries, upsertDailyActivity } from '@/db/timelineRepository';
import { importCalendarEvents, getCalendarPermission } from '@/services/calendar';
import { toServiceError } from '@/services/errors';
import { getHealthPermission, importHealth } from '@/services/health';
import {
  IMPORT_SOURCES,
  type ImportRange,
  type ImportSource,
  type ImportSourceOutcome,
  type ImportedEntry,
  type TripImportSummary,
} from '@/services/import/types';
import { logger } from '@/services/logger';
import { canRead, type PermissionState } from '@/services/permissions';
import { getPhotoPermission, importPhotos } from '@/services/photos';
import type { Trip } from '@/types';

import { attachActivityToTrip, attachEntriesToTrip, getTripImportRange } from './attachToTrip';

export interface TripImportOptions {
  sources?: readonly ImportSource[];
  /** Calendars to read; all event calendars when omitted. */
  calendarIds?: string[];
}

/**
 * Rebuilds a trip's skeleton timeline from data already on the phone.
 *
 * Each source runs independently: a denied permission or a failing source is reported in the
 * summary and never stops the others. This never shows permission prompts — screens ask first
 * (with the onboarding copy) and then run the import.
 */
export async function runTripImport(
  trip: Trip,
  options: TripImportOptions = {},
): Promise<TripImportSummary> {
  const range = getTripImportRange(trip, new Date());
  const sources = options.sources ?? IMPORT_SOURCES;

  const outcomes = await Promise.all(
    sources.map((source) => runSource(source, trip.id, range, options)),
  );
  return { tripId: trip.id, range, outcomes };
}

async function runSource(
  source: ImportSource,
  tripId: string,
  range: ImportRange,
  options: TripImportOptions,
): Promise<ImportSourceOutcome> {
  try {
    const permission = await getPermission(source);
    if (permission === 'unavailable') {
      return { source, status: 'unavailable' };
    }
    if (!canRead(permission)) {
      return { source, status: 'permission_denied' };
    }

    switch (source) {
      case 'photos': {
        const result = await importPhotos(range);
        return saveEntries(source, tripId, result.entries);
      }
      case 'calendar': {
        const entries = await importCalendarEvents(range, options.calendarIds);
        return saveEntries(source, tripId, entries);
      }
      case 'health': {
        const result = await importHealth(range);
        await upsertDailyActivity(attachActivityToTrip(result.dailySteps, tripId, new Date()));
        return saveEntries(source, tripId, result.workouts);
      }
    }
  } catch (error) {
    const serviceError = toServiceError(error, 'unknown');
    logger.error(`Import failed for ${source}`, error);
    return { source, status: 'failed', error: serviceError };
  }
}

function getPermission(source: ImportSource): Promise<PermissionState> {
  switch (source) {
    case 'photos':
      return getPhotoPermission();
    case 'calendar':
      return getCalendarPermission();
    case 'health':
      return getHealthPermission();
  }
}

/** Entries already in the trip (same externalId) are skipped by the repository. */
async function saveEntries(
  source: ImportSource,
  tripId: string,
  entries: ImportedEntry[],
): Promise<ImportSourceOutcome> {
  const added = await insertTimelineEntries(
    attachEntriesToTrip(entries, tripId, randomUUID, new Date()),
  );
  return {
    source,
    status: 'imported',
    found: entries.length,
    added,
    skipped: entries.length - added,
  };
}

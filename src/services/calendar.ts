import {
  EntityTypes,
  getCalendarPermissions,
  getCalendars,
  listEvents,
  requestCalendarPermissions,
  type ExpoCalendarEvent,
} from 'expo-calendar';

import { toServiceError } from './errors';
import type { ImportRange, ImportedEntry } from './import/types';
import { fromExpoPermission, type PermissionState } from './permissions';

export interface CalendarSummary {
  id: string;
  title: string;
  color: string | null;
  sourceName: string;
}

export async function getCalendarPermission(): Promise<PermissionState> {
  try {
    return fromExpoPermission(await getCalendarPermissions());
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

export async function requestCalendarPermission(): Promise<PermissionState> {
  try {
    return fromExpoPermission(await requestCalendarPermissions());
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

/** Event calendars on the device, so the user can choose which ones a trip should include. */
export async function listEventCalendars(): Promise<CalendarSummary[]> {
  try {
    const calendars = await getCalendars(EntityTypes.EVENT);
    return calendars.map((calendar) => ({
      id: calendar.id,
      title: calendar.title,
      color: calendar.color ?? null,
      sourceName: calendar.source.name,
    }));
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

/**
 * Reads events overlapping the range from the chosen calendars (all event calendars when
 * `calendarIds` is omitted). Every event becomes an `event` entry.
 * TODO: Classify flights, stays, and transit from event titles once the rules are specified.
 */
export async function importCalendarEvents(
  range: ImportRange,
  calendarIds?: string[],
): Promise<ImportedEntry[]> {
  try {
    const ids = calendarIds ?? (await listEventCalendars()).map((calendar) => calendar.id);
    if (ids.length === 0) {
      return [];
    }
    const events = await listEvents(ids, range.start, range.end);
    return events.map(toImportedEntry);
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

function toImportedEntry(event: ExpoCalendarEvent): ImportedEntry {
  const startAt = new Date(event.startDate);
  const endAt = new Date(event.endDate);
  return {
    type: 'event',
    source: 'automatic',
    // Recurring events share one id across occurrences, so the start time keeps each unique.
    externalId: `calendar:${event.id}:${startAt.getTime()}`,
    timestamp: startAt,
    durationMs: Math.max(0, endAt.getTime() - startAt.getTime()),
    // Calendar locations are free text, not coordinates; they're kept in the payload.
    location: null,
    payload: {
      eventId: event.id,
      calendarId: event.calendarId,
      title: event.title,
      locationName: event.location,
      allDay: event.allDay,
      endAt: endAt.toISOString(),
      timeZone: event.timeZone,
    },
  };
}

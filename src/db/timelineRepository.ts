import { asc, eq } from 'drizzle-orm';

import type { DailyActivity, TimelineEntry, TimelineEntryType } from '@/types';

import { db } from './client';
import { toDailyActivity, toTimelineEntry, toTimelineEntryInsert } from './mappers';
import { dailyActivity, timelineEntries } from './schema';
import { withDatabase } from './withDatabase';

// Keeps each INSERT well under SQLite's bound-parameter limit (13 columns per entry).
const INSERT_CHUNK_SIZE = 200;

export async function listTimelineEntries(tripId: string): Promise<TimelineEntry[]> {
  return withDatabase('listTimelineEntries', async () => {
    const rows = await db
      .select()
      .from(timelineEntries)
      .where(eq(timelineEntries.tripId, tripId))
      .orderBy(asc(timelineEntries.timestamp));
    return rows.map(toTimelineEntry);
  });
}

/** Entries of one type across every trip (e.g. all workouts for lifetime stats). */
export async function listTimelineEntriesByType(type: TimelineEntryType): Promise<TimelineEntry[]> {
  return withDatabase('listTimelineEntriesByType', async () => {
    const rows = await db
      .select()
      .from(timelineEntries)
      .where(eq(timelineEntries.type, type))
      .orderBy(asc(timelineEntries.timestamp));
    return rows.map(toTimelineEntry);
  });
}

/**
 * Inserts entries in one transaction. Entries whose (trip, externalId) already exist are skipped,
 * so imports can be re-run safely. Returns how many new entries were written.
 */
export async function insertTimelineEntries(entries: TimelineEntry[]): Promise<number> {
  if (entries.length === 0) {
    return 0;
  }
  return withDatabase('insertTimelineEntries', async () =>
    db.transaction(async (tx) => {
      let inserted = 0;
      for (let start = 0; start < entries.length; start += INSERT_CHUNK_SIZE) {
        const chunk = entries.slice(start, start + INSERT_CHUNK_SIZE).map(toTimelineEntryInsert);
        const rows = await tx
          .insert(timelineEntries)
          .values(chunk)
          .onConflictDoNothing()
          .returning({ id: timelineEntries.id });
        inserted += rows.length;
      }
      return inserted;
    }),
  );
}

export async function listDailyActivity(tripId: string): Promise<DailyActivity[]> {
  return withDatabase('listDailyActivity', async () => {
    const rows = await db
      .select()
      .from(dailyActivity)
      .where(eq(dailyActivity.tripId, tripId))
      .orderBy(asc(dailyActivity.date));
    return rows.map(toDailyActivity);
  });
}

/** Writes each day's step total, replacing any earlier import for the same day. */
export async function upsertDailyActivity(days: DailyActivity[]): Promise<number> {
  if (days.length === 0) {
    return 0;
  }
  return withDatabase('upsertDailyActivity', async () =>
    db.transaction(async (tx) => {
      for (const day of days) {
        await tx
          .insert(dailyActivity)
          .values(day)
          .onConflictDoUpdate({
            target: [dailyActivity.tripId, dailyActivity.date],
            set: { steps: day.steps, source: day.source, updatedAt: day.updatedAt },
          });
      }
      return days.length;
    }),
  );
}

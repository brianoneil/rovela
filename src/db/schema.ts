import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

import {
  ENTRY_SOURCES,
  HEALTH_SOURCES,
  PLACE_CATEGORIES,
  TIMELINE_ENTRY_TYPES,
  type Geofence,
  type TimelineEntryPayload,
} from '@/types';

/**
 * Local trip database (expo-sqlite + Drizzle). All trip data stays on-device.
 * After changing this file run `npm run db:generate` to create a migration in src/db/migrations.
 *
 * Timestamps are stored as integer milliseconds and read back as Date objects.
 * Locations are stored as flat nullable columns so they can be indexed and queried by area later.
 */

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  startAt: integer('start_at', { mode: 'timestamp_ms' }).notNull(),
  endAt: integer('end_at', { mode: 'timestamp_ms' }),
  homeGeofence: text('home_geofence', { mode: 'json' }).$type<Geofence>(),
  destinations: text('destinations', { mode: 'json' }).$type<string[]>().notNull(),
  coverImageRef: text('cover_image_ref'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const timelineEntries = sqliteTable(
  'timeline_entries',
  {
    id: text('id').primaryKey(),
    tripId: text('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    timestamp: integer('timestamp', { mode: 'timestamp_ms' }).notNull(),
    durationMs: integer('duration_ms'),
    type: text('type', { enum: TIMELINE_ENTRY_TYPES }).notNull(),
    source: text('source', { enum: ENTRY_SOURCES }).notNull(),
    externalId: text('external_id'),
    lat: real('lat'),
    lng: real('lng'),
    altitude: real('altitude'),
    accuracy: real('accuracy'),
    payload: text('payload', { mode: 'json' }).$type<TimelineEntryPayload>().notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('timeline_entries_trip_time_idx').on(table.tripId, table.timestamp),
    index('timeline_entries_trip_type_idx').on(table.tripId, table.type),
    // Re-importing the same photo / workout / event into a trip is a no-op.
    // SQLite treats NULLs as distinct, so manual entries (no external id) are unaffected.
    uniqueIndex('timeline_entries_trip_external_idx').on(table.tripId, table.externalId),
  ],
);

/** One row per trip per local day with the health store's step total. */
export const dailyActivity = sqliteTable(
  'daily_activity',
  {
    tripId: text('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    date: text('date').notNull(),
    steps: integer('steps').notNull(),
    source: text('source', { enum: HEALTH_SOURCES }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.tripId, table.date] })],
);

export const places = sqliteTable('places', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category', { enum: PLACE_CATEGORIES }).notNull(),
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  altitude: real('altitude'),
  accuracy: real('accuracy'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const people = sqliteTable('people', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  context: text('context'),
  photoRef: text('photo_ref'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

/** Links a place to the timeline entries that happened there. */
export const timelineEntryPlaces = sqliteTable(
  'timeline_entry_places',
  {
    entryId: text('entry_id')
      .notNull()
      .references(() => timelineEntries.id, { onDelete: 'cascade' }),
    placeId: text('place_id')
      .notNull()
      .references(() => places.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.entryId, table.placeId] })],
);

/** Links a person to the timeline entries they appear in. */
export const timelineEntryPeople = sqliteTable(
  'timeline_entry_people',
  {
    entryId: text('entry_id')
      .notNull()
      .references(() => timelineEntries.id, { onDelete: 'cascade' }),
    personId: text('person_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.entryId, table.personId] })],
);

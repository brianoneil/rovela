import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

export const DATABASE_NAME = 'rovela.db';

// Change listeners let Drizzle's useLiveQuery re-render screens when rows change.
const sqlite = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

// SQLite leaves foreign keys off by default; the schema relies on cascading deletes.
sqlite.execSync('PRAGMA foreign_keys = ON;');

export const db = drizzle(sqlite, { schema });

export type Database = typeof db;

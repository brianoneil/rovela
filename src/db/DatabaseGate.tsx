import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, type ReactNode } from 'react';

import { ErrorState } from '@/components/ErrorState';
import { logger } from '@/services/logger';

import { db } from './client';
import migrations from './migrations/migrations';

interface DatabaseGateProps {
  /** Called once migrations have finished (successfully or not) so the splash can hide. */
  onSettled: () => void;
  children: ReactNode;
}

/** Runs pending database migrations before rendering the app. */
export function DatabaseGate({ onSettled, children }: DatabaseGateProps) {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (error) {
      logger.error('Database migration failed', error);
    }
    if (success || error) {
      onSettled();
    }
  }, [success, error, onSettled]);

  if (error) {
    return (
      <ErrorState
        title="Couldn’t open your trips"
        message="Rovela couldn’t prepare its on-device database. Restart the app to try again."
      />
    );
  }

  if (!success) {
    // The native splash screen stays visible while migrations run.
    return null;
  }

  return children;
}

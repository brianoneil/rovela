import type { ErrorBoundaryProps } from 'expo-router';

import { logger } from '@/services/logger';

import { ErrorState } from './ErrorState';

/**
 * Screen-level error boundary. Expo Router renders this when a route throws;
 * re-export it as `ErrorBoundary` from a layout or route file to use it.
 */
export function AppErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  logger.error('Unhandled screen error', error);
  return (
    <ErrorState
      title="Something went wrong"
      message="This screen hit a problem. Your trip data is safe."
      actionLabel="Try again"
      onAction={retry}
    />
  );
}

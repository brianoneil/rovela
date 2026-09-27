import { logger } from '@/services/logger';
import { toServiceError } from '@/services/errors';

/**
 * Runs a database operation and rethrows any failure as a `database` ServiceError
 * (existing ServiceErrors such as `not_found` or `invalid_input` pass through unchanged).
 * Throwing keeps repositories compatible with TanStack Query, which expects rejected promises.
 */
export async function withDatabase<T>(label: string, operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const serviceError = toServiceError(error, 'database');
    if (serviceError.code === 'database') {
      logger.error(`Database operation failed: ${label}`, error);
    }
    throw serviceError;
  }
}

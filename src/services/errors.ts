/**
 * Typed errors for every platform, database, and network call.
 * `userMessage` is always safe to show on screen; `cause` keeps the original error for logging.
 * Permission denial is an expected state, so it has its own code rather than being a crash.
 */

export type ServiceErrorCode =
  | 'permission_denied'
  | 'not_found'
  | 'database'
  | 'network'
  | 'platform_unavailable'
  | 'invalid_input'
  | 'unknown';

const DEFAULT_USER_MESSAGES: Record<ServiceErrorCode, string> = {
  permission_denied: 'Rovela needs permission to do that. You can change it in Settings.',
  not_found: 'We couldn’t find that.',
  database: 'Something went wrong saving or loading your trip data.',
  network: 'Can’t reach the network right now. Try again when you’re connected.',
  platform_unavailable: 'This feature isn’t available on this device.',
  invalid_input: 'Some of that information doesn’t look right.',
  unknown: 'Something went wrong. Please try again.',
};

export class ServiceError extends Error {
  readonly code: ServiceErrorCode;
  readonly userMessage: string;
  readonly cause: unknown;

  constructor(
    code: ServiceErrorCode,
    options: { message?: string; userMessage?: string; cause?: unknown } = {},
  ) {
    super(options.message ?? code);
    this.name = 'ServiceError';
    this.code = code;
    this.userMessage = options.userMessage ?? DEFAULT_USER_MESSAGES[code];
    this.cause = options.cause;
  }
}

export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError;
}

/** Wraps any thrown value in a ServiceError, keeping existing ServiceErrors unchanged. */
export function toServiceError(error: unknown, fallbackCode: ServiceErrorCode): ServiceError {
  if (isServiceError(error)) {
    return error;
  }
  const message = error instanceof Error ? error.message : String(error);
  return new ServiceError(fallbackCode, { message, cause: error });
}

export type ServiceResult<T> = { ok: true; value: T } | { ok: false; error: ServiceError };

/**
 * Runs a service operation and returns a result instead of throwing, so callers must handle
 * the failure branch explicitly.
 */
export async function runService<T>(
  operation: () => Promise<T>,
  fallbackCode: ServiceErrorCode,
): Promise<ServiceResult<T>> {
  try {
    return { ok: true, value: await operation() };
  } catch (error) {
    return { ok: false, error: toServiceError(error, fallbackCode) };
  }
}

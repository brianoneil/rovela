import { runService, ServiceError, toServiceError } from '../errors';

describe('toServiceError', () => {
  it('keeps an existing ServiceError unchanged', () => {
    const original = new ServiceError('permission_denied');
    expect(toServiceError(original, 'unknown')).toBe(original);
  });

  it('wraps other errors with the fallback code and a user-safe message', () => {
    const wrapped = toServiceError(new Error('SQLITE_BUSY'), 'database');
    expect(wrapped.code).toBe('database');
    expect(wrapped.message).toBe('SQLITE_BUSY');
    expect(wrapped.userMessage).not.toContain('SQLITE');
  });
});

describe('runService', () => {
  it('returns the value on success', async () => {
    await expect(runService(async () => 42, 'unknown')).resolves.toEqual({ ok: true, value: 42 });
  });

  it('returns a typed error instead of throwing', async () => {
    const result = await runService(async () => {
      throw new Error('offline');
    }, 'network');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('network');
    }
  });
});

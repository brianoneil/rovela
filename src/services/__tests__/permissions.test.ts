import { canRead, fromExpoPermission } from '../permissions';

describe('fromExpoPermission', () => {
  it('maps full and limited access', () => {
    expect(fromExpoPermission({ granted: true, canAskAgain: true, status: 'granted' })).toBe(
      'granted',
    );
    expect(
      fromExpoPermission({
        granted: true,
        canAskAgain: true,
        status: 'granted',
        accessPrivileges: 'limited',
      }),
    ).toBe('limited');
  });

  it('separates not-yet-asked from denied', () => {
    expect(fromExpoPermission({ granted: false, canAskAgain: true, status: 'undetermined' })).toBe(
      'undetermined',
    );
    expect(fromExpoPermission({ granted: false, canAskAgain: false, status: 'denied' })).toBe(
      'denied',
    );
  });
});

describe('canRead', () => {
  it('allows reading only when some access exists', () => {
    expect(canRead('limited')).toBe(true);
    expect(canRead('requested')).toBe(true);
    expect(canRead('undetermined')).toBe(false);
    expect(canRead('unavailable')).toBe(false);
  });
});

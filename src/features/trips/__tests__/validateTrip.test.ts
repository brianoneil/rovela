import { ServiceError } from '@/services/errors';

import { validateTripInput } from '../validateTrip';

const start = new Date('2026-02-10T08:00:00Z');
const end = new Date('2026-02-18T20:00:00Z');

describe('validateTripInput', () => {
  it('trims the name and cleans lists', () => {
    const result = validateTripInput({
      name: '  Patagonia  ',
      startAt: start,
      endAt: end,
      tags: [' hiking', 'hiking', ''],
    });
    expect(result.name).toBe('Patagonia');
    expect(result.tags).toEqual(['hiking']);
    expect(result.destinations).toEqual([]);
  });

  it('allows an active trip with no end date', () => {
    expect(validateTripInput({ name: 'Now', startAt: start, endAt: null }).endAt).toBeNull();
  });

  it('rejects a blank name', () => {
    expect(() => validateTripInput({ name: '   ', startAt: start, endAt: end })).toThrow(
      ServiceError,
    );
  });

  it('rejects an end before the start', () => {
    try {
      validateTripInput({ name: 'Backwards', startAt: end, endAt: start });
      throw new Error('expected validation to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError);
      expect((error as ServiceError).code).toBe('invalid_input');
    }
  });
});

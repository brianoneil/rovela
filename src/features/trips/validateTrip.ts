import { ServiceError } from '@/services/errors';
import type { TripInput } from '@/types';

export const TRIP_NAME_MAX_LENGTH = 80;

/**
 * Checks and cleans user-entered trip fields. Throws an `invalid_input` ServiceError with a
 * message that is safe to show next to the form.
 */
export function validateTripInput(input: TripInput): TripInput {
  const name = input.name.trim();
  if (name.length === 0) {
    throw new ServiceError('invalid_input', { userMessage: 'Give your trip a name.' });
  }
  if (name.length > TRIP_NAME_MAX_LENGTH) {
    throw new ServiceError('invalid_input', {
      userMessage: `Trip names can be up to ${TRIP_NAME_MAX_LENGTH} characters.`,
    });
  }
  if (Number.isNaN(input.startAt.getTime())) {
    throw new ServiceError('invalid_input', { userMessage: 'Choose a start date.' });
  }
  if (input.endAt !== null) {
    if (Number.isNaN(input.endAt.getTime())) {
      throw new ServiceError('invalid_input', { userMessage: 'Choose a valid end date.' });
    }
    if (input.endAt.getTime() < input.startAt.getTime()) {
      throw new ServiceError('invalid_input', {
        userMessage: 'The trip can’t end before it starts.',
      });
    }
  }

  return {
    ...input,
    name,
    destinations: cleanList(input.destinations),
    tags: cleanList(input.tags),
  };
}

/** Trims entries, drops blanks, and removes duplicates while keeping the user's order. */
function cleanList(values: string[] | undefined): string[] {
  if (!values) {
    return [];
  }
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed.length > 0 && !seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  }
  return result;
}

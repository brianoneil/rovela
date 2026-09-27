import type { TimelineEntry } from '@/types';

// Activity names from HealthKit (camelCase enum keys) and Health Connect (UPPER_CASE), lowercased.
const FOOT_ACTIVITIES = new Set(['walking', 'running', 'hiking']);

const KM_PER_UNIT: Record<string, number> = {
  m: 0.001,
  km: 1,
  mi: 1.609344,
  ft: 0.0003048,
  yd: 0.0009144,
};

/**
 * Total kilometers covered in walking, running, and hiking workouts, using the distance each
 * workout recorded. Workouts without a distance (or in an unknown unit) are left out.
 * Returns null when no foot workout has a distance, so screens can hide the stat rather than
 * showing a misleading "0 km".
 */
export function sumFootDistanceKm(workouts: TimelineEntry[]): number | null {
  let total = 0;
  let counted = 0;
  for (const workout of workouts) {
    const activity = workout.payload.activityType;
    if (typeof activity !== 'string' || !FOOT_ACTIVITIES.has(activity.toLowerCase())) {
      continue;
    }
    const km = distanceKm(workout.payload.totalDistance);
    if (km !== null) {
      total += km;
      counted += 1;
    }
  }
  return counted > 0 ? total : null;
}

function distanceKm(value: unknown): number | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const { quantity, unit } = value as { quantity?: unknown; unit?: unknown };
  if (typeof quantity !== 'number' || typeof unit !== 'string') {
    return null;
  }
  const factor = KM_PER_UNIT[unit];
  return factor === undefined ? null : quantity * factor;
}

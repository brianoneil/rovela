import {
  AuthorizationRequestStatus,
  WorkoutActivityType,
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  queryStatisticsCollectionForQuantity,
  queryWorkoutSamples,
  requestAuthorization,
  type WorkoutProxyTyped,
} from '@kingstinct/react-native-healthkit';

import { toServiceError } from '@/services/errors';
import type { ImportRange, ImportedDailyActivity, ImportedEntry } from '@/services/import/types';
import { logger } from '@/services/logger';
import type { PermissionState } from '@/services/permissions';
import { startOfLocalDay, toLocalDateKey } from '@/utils/dates';

import type { RoutePoint } from './types';

// Read-only access. Must stay in sync with NSHealthShareUsageDescription in app.json.
const READ_TYPES = [
  'HKWorkoutTypeIdentifier',
  'HKWorkoutRouteTypeIdentifier',
  'HKQuantityTypeIdentifierStepCount',
  'HKQuantityTypeIdentifierDistanceWalkingRunning',
] as const;

const AUTH_REQUEST = { toRead: READ_TYPES };

/**
 * HealthKit never tells an app whether read access was granted (a privacy rule). The most it
 * reports is whether the prompt still needs to be shown, so after prompting the state is
 * `requested` and imports return whatever data the user allowed.
 */
export async function getHealthKitPermission(): Promise<PermissionState> {
  if (!isHealthDataAvailable()) {
    return 'unavailable';
  }
  try {
    const status = await getRequestStatusForAuthorization(AUTH_REQUEST);
    return status === AuthorizationRequestStatus.unnecessary ? 'requested' : 'undetermined';
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

export async function requestHealthKitPermission(): Promise<PermissionState> {
  if (!isHealthDataAvailable()) {
    return 'unavailable';
  }
  try {
    await requestAuthorization(AUTH_REQUEST);
    return 'requested';
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

export async function importHealthKitWorkouts(range: ImportRange): Promise<ImportedEntry[]> {
  let workouts: readonly WorkoutProxyTyped[];
  try {
    workouts = await queryWorkoutSamples({
      // A non-positive limit returns every workout in the range.
      limit: 0,
      ascending: true,
      filter: { date: { startDate: range.start, endDate: range.end } },
    });
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
  return Promise.all(workouts.map(toWorkoutEntry));
}

/**
 * Asks HealthKit for step totals bucketed by local calendar day. HealthKit does the summing and
 * de-duplicates overlapping iPhone + Apple Watch samples, so the totals match the Health app.
 */
export async function importHealthKitDailySteps(
  range: ImportRange,
): Promise<ImportedDailyActivity[]> {
  try {
    const buckets = await queryStatisticsCollectionForQuantity(
      'HKQuantityTypeIdentifierStepCount',
      ['cumulativeSum'],
      startOfLocalDay(range.start),
      { day: 1 },
      { filter: { date: { startDate: range.start, endDate: range.end } }, unit: 'count' },
    );
    const days: ImportedDailyActivity[] = [];
    for (const bucket of buckets) {
      if (bucket.startDate && bucket.sumQuantity) {
        days.push({
          date: toLocalDateKey(bucket.startDate),
          steps: Math.round(bucket.sumQuantity.quantity),
          source: 'healthkit',
        });
      }
    }
    return days;
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

async function toWorkoutEntry(workout: WorkoutProxyTyped): Promise<ImportedEntry> {
  const route = await readRoute(workout);
  const first = route[0];
  return {
    type: 'workout',
    source: 'automatic',
    externalId: `healthkit:${workout.uuid}`,
    timestamp: workout.startDate,
    durationMs: workout.endDate.getTime() - workout.startDate.getTime(),
    location: first ? { lat: first.lat, lng: first.lng, altitude: first.altitude } : null,
    payload: {
      activityType: WorkoutActivityType[workout.workoutActivityType] ?? null,
      activityTypeCode: workout.workoutActivityType,
      // Quantities keep HealthKit's own units; convert for display, not on import.
      totalDistance: workout.totalDistance ?? null,
      totalEnergyBurned: workout.totalEnergyBurned ?? null,
      sourceName: workout.sourceRevision.source.name,
      route,
      // TODO: Add elevation gain and heart rate once the workout card design defines them.
    },
  };
}

/** Workouts recorded without GPS (indoor, gym) have no route; that's expected. */
async function readRoute(workout: WorkoutProxyTyped): Promise<RoutePoint[]> {
  try {
    const routes = await workout.getWorkoutRoutes();
    return routes.flatMap((route) =>
      route.locations.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
        altitude: point.altitude,
        timestamp: point.date.getTime(),
      })),
    );
  } catch (error) {
    logger.warn('Could not read workout route', error);
    return [];
  }
}

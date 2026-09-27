import { Platform } from 'react-native';

import type { ImportRange, ImportedDailyActivity, ImportedEntry } from '@/services/import/types';
import type { PermissionState } from '@/services/permissions';

import {
  getHealthConnectPermission,
  importHealthConnectDailySteps,
  importHealthConnectWorkouts,
  requestHealthConnectPermission,
} from './healthConnect';
import {
  getHealthKitPermission,
  importHealthKitDailySteps,
  importHealthKitWorkouts,
  requestHealthKitPermission,
} from './healthKit';

/**
 * Platform-neutral health access: HealthKit on iOS, Health Connect on Android.
 * Other platforms (web) report `unavailable`.
 */
export async function getHealthPermission(): Promise<PermissionState> {
  if (Platform.OS === 'ios') return getHealthKitPermission();
  if (Platform.OS === 'android') return getHealthConnectPermission();
  return 'unavailable';
}

export async function requestHealthPermission(): Promise<PermissionState> {
  if (Platform.OS === 'ios') return requestHealthKitPermission();
  if (Platform.OS === 'android') return requestHealthConnectPermission();
  return 'unavailable';
}

export interface HealthImportResult {
  workouts: ImportedEntry[];
  dailySteps: ImportedDailyActivity[];
}

export async function importHealth(range: ImportRange): Promise<HealthImportResult> {
  if (Platform.OS === 'ios') {
    const [workouts, dailySteps] = await Promise.all([
      importHealthKitWorkouts(range),
      importHealthKitDailySteps(range),
    ]);
    return { workouts, dailySteps };
  }
  if (Platform.OS === 'android') {
    const [workouts, dailySteps] = await Promise.all([
      importHealthConnectWorkouts(range),
      importHealthConnectDailySteps(range),
    ]);
    return { workouts, dailySteps };
  }
  return { workouts: [], dailySteps: [] };
}

import {
  ExerciseType,
  SdkAvailabilityStatus,
  aggregateRecord,
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  readRecords,
  requestPermission,
  type Permission,
  type RecordResult,
} from 'react-native-health-connect';

import { toServiceError } from '@/services/errors';
import type { ImportRange, ImportedDailyActivity, ImportedEntry } from '@/services/import/types';
import type { PermissionState } from '@/services/permissions';
import { splitIntoLocalDays, toLocalDateKey } from '@/utils/dates';

// Must stay in sync with the android.permission.health.READ_* entries in app.json.
const READ_PERMISSIONS: Permission[] = [
  { accessType: 'read', recordType: 'ExerciseSession' },
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'Distance' },
  { accessType: 'read', recordType: 'ElevationGained' },
];

const EXERCISE_TYPE_NAMES = new Map<number, string>(
  Object.entries(ExerciseType).map(([name, code]) => [code, name]),
);

/**
 * Health Connect is a separate app on older Android versions. Returns false when it is missing or
 * needs an update, which callers treat as `unavailable`. The client must be initialized before
 * any other call.
 */
async function ensureClient(): Promise<boolean> {
  const status = await getSdkStatus();
  if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
    return false;
  }
  return initialize();
}

/**
 * Health Connect reports which permissions are granted but not whether the user said no, so
 * "none granted" is `undetermined`.
 */
export async function getHealthConnectPermission(): Promise<PermissionState> {
  try {
    if (!(await ensureClient())) {
      return 'unavailable';
    }
    return toPermissionState(await getGrantedPermissions());
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

export async function requestHealthConnectPermission(): Promise<PermissionState> {
  try {
    if (!(await ensureClient())) {
      return 'unavailable';
    }
    return toPermissionState(await requestPermission(READ_PERMISSIONS));
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

export async function importHealthConnectWorkouts(range: ImportRange): Promise<ImportedEntry[]> {
  try {
    const sessions: RecordResult<'ExerciseSession'>[] = [];
    let pageToken: string | undefined;
    do {
      const page = await readRecords('ExerciseSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime: range.start.toISOString(),
          endTime: range.end.toISOString(),
        },
        ascendingOrder: true,
        pageToken,
      });
      sessions.push(...page.records);
      pageToken = page.pageToken || undefined;
    } while (pageToken);
    return sessions.flatMap(toWorkoutEntry);
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

/**
 * Health Connect sums and de-duplicates steps across apps per request, so each local day is
 * requested separately. Days with no recorded data (no data origins) are left out rather than
 * stored as zero.
 */
export async function importHealthConnectDailySteps(
  range: ImportRange,
): Promise<ImportedDailyActivity[]> {
  try {
    const days: ImportedDailyActivity[] = [];
    for (const day of splitIntoLocalDays(range.start, range.end)) {
      const result = await aggregateRecord({
        recordType: 'Steps',
        timeRangeFilter: {
          operator: 'between',
          startTime: day.start.toISOString(),
          endTime: day.end.toISOString(),
        },
      });
      if (result.dataOrigins.length > 0) {
        days.push({
          date: toLocalDateKey(day.start),
          steps: result.COUNT_TOTAL,
          source: 'health_connect',
        });
      }
    }
    return days;
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

function toPermissionState(granted: readonly { accessType: string; recordType: string }[]) {
  const grantedCount = READ_PERMISSIONS.filter((wanted) =>
    granted.some(
      (item) => item.accessType === wanted.accessType && item.recordType === wanted.recordType,
    ),
  ).length;
  if (grantedCount === READ_PERMISSIONS.length) {
    return 'granted' as const;
  }
  return grantedCount > 0 ? ('limited' as const) : ('undetermined' as const);
}

/** Sessions without an id can't be de-duplicated on re-import, so they are skipped. */
function toWorkoutEntry(session: RecordResult<'ExerciseSession'>): ImportedEntry[] {
  const id = session.metadata?.id;
  if (!id) {
    return [];
  }
  const startAt = new Date(session.startTime);
  const endAt = new Date(session.endTime);
  return [
    {
      type: 'workout',
      source: 'automatic',
      externalId: `health_connect:${id}`,
      timestamp: startAt,
      durationMs: endAt.getTime() - startAt.getTime(),
      location: null,
      payload: {
        activityType: EXERCISE_TYPE_NAMES.get(session.exerciseType) ?? null,
        activityTypeCode: session.exerciseType,
        title: session.title ?? null,
        sourceName: session.metadata?.dataOrigin ?? null,
        route: [],
        // TODO: Read routes with requestExerciseRoute (needs per-workout consent) and
        // distance / elevation for the session window once the workout card is designed.
      },
    },
  ];
}

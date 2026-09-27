/**
 * One permission vocabulary for every data source, so screens can render the same states.
 * - `limited`: the user shared only some items (e.g. selected photos). Import still works on those.
 * - `unavailable`: the device can't provide this data at all (e.g. no Health app, simulator).
 * - `requested`: a prompt has been shown but the platform won't say what was chosen. HealthKit
 *   never reveals read access, so imports simply return whatever data they are allowed to see.
 */
export type PermissionState =
  'granted' | 'limited' | 'requested' | 'denied' | 'undetermined' | 'unavailable';

/** Shape shared by Expo module permission responses. */
interface ExpoPermissionLike {
  granted: boolean;
  canAskAgain: boolean;
  status: string;
  accessPrivileges?: 'all' | 'limited' | 'none';
}

export function fromExpoPermission(response: ExpoPermissionLike): PermissionState {
  if (response.granted) {
    return response.accessPrivileges === 'limited' ? 'limited' : 'granted';
  }
  if (response.status === 'undetermined' && response.canAskAgain) {
    return 'undetermined';
  }
  return 'denied';
}

/** True when an import can read at least some data for this source. */
export function canRead(state: PermissionState): boolean {
  return state === 'granted' || state === 'limited' || state === 'requested';
}

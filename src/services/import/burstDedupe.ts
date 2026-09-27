import type { ImportedEntry } from './types';

/**
 * Longest gap between two shots for them to count as the same burst.
 * TODO: Tune against real camera rolls; replace with sharpness scoring ("smart selection").
 */
export const BURST_MAX_GAP_MS = 1500;

/**
 * Collapses photo bursts into one timeline entry.
 *
 * How it works, in plain terms:
 * 1. Photos are sorted by capture time. Videos and other entry types pass through untouched.
 * 2. Walking forward, a photo joins the current burst if it was taken within BURST_MAX_GAP_MS of
 *    the previous photo in that burst. A bigger gap starts a new burst.
 * 3. Each burst keeps one photo: the first one the user marked as a favorite, otherwise the first
 *    shot. The other shots are not dropped from the library; their ids are listed on the kept
 *    entry as `payload.burstAssetIds` so the UI can offer them later.
 */
export function collapseBursts(entries: ImportedEntry[]): ImportedEntry[] {
  const photos = entries
    .filter((entry) => entry.type === 'photo')
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const others = entries.filter((entry) => entry.type !== 'photo');

  const bursts: ImportedEntry[][] = [];
  for (const photo of photos) {
    const current = bursts[bursts.length - 1];
    const previous = current?.[current.length - 1];
    if (
      current &&
      previous &&
      photo.timestamp.getTime() - previous.timestamp.getTime() <= BURST_MAX_GAP_MS
    ) {
      current.push(photo);
    } else {
      bursts.push([photo]);
    }
  }

  const kept = bursts.map(pickBurstRepresentative);
  return [...kept, ...others].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

function pickBurstRepresentative(burst: ImportedEntry[]): ImportedEntry {
  const first = burst[0];
  if (!first) {
    throw new RangeError('A burst always has at least one photo');
  }
  if (burst.length === 1) {
    return first;
  }
  const keep = burst.find((photo) => photo.payload.isFavorite === true) ?? first;
  const burstAssetIds = burst
    .filter((photo) => photo !== keep)
    .map((photo) => photo.payload.assetId)
    .filter((id): id is string => typeof id === 'string');
  return { ...keep, payload: { ...keep.payload, burstAssetIds } };
}

import { BURST_MAX_GAP_MS, collapseBursts } from '../burstDedupe';
import type { ImportedEntry } from '../types';

function photo(assetId: string, timeMs: number, isFavorite = false): ImportedEntry {
  return {
    type: 'photo',
    source: 'automatic',
    externalId: `media:${assetId}`,
    timestamp: new Date(timeMs),
    durationMs: null,
    location: null,
    payload: { assetId, isFavorite },
  };
}

describe('collapseBursts', () => {
  it('keeps photos that are far apart', () => {
    const result = collapseBursts([photo('a', 0), photo('b', 10_000)]);
    expect(result.map((entry) => entry.payload.assetId)).toEqual(['a', 'b']);
  });

  it('keeps the first shot of a burst and lists the rest', () => {
    const result = collapseBursts([
      photo('c', 2 * BURST_MAX_GAP_MS),
      photo('a', 0),
      photo('b', BURST_MAX_GAP_MS),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]?.payload.assetId).toBe('a');
    expect(result[0]?.payload.burstAssetIds).toEqual(['b', 'c']);
  });

  it('prefers a favorite shot over the first one', () => {
    const result = collapseBursts([photo('a', 0), photo('b', 500, true)]);
    expect(result[0]?.payload.assetId).toBe('b');
    expect(result[0]?.payload.burstAssetIds).toEqual(['a']);
  });

  it('never merges videos', () => {
    const video: ImportedEntry = { ...photo('v', 100), type: 'video', externalId: 'media:v' };
    const result = collapseBursts([photo('a', 0), video]);
    expect(result.map((entry) => entry.type)).toEqual(['photo', 'video']);
  });
});

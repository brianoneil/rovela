import {
  Asset,
  AssetField,
  MediaType,
  Query,
  getPermissionsAsync,
  requestPermissionsAsync,
  type AssetMetadata,
  type GranularPermission,
} from 'expo-media-library';
import { Platform } from 'react-native';

import type { GeoPoint } from '@/types';

import { toServiceError } from './errors';
import { collapseBursts } from './import/burstDedupe';
import type { ImportRange, ImportedEntry } from './import/types';
import { logger } from './logger';
import { fromExpoPermission, type PermissionState } from './permissions';

// Rovela only reads photos and videos; never ask for audio access.
const GRANULAR: GranularPermission[] = ['photo', 'video'];
const PAGE_SIZE = 200;

export async function getPhotoPermission(): Promise<PermissionState> {
  try {
    return fromExpoPermission(await getPermissionsAsync(false, GRANULAR));
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

export async function requestPhotoPermission(): Promise<PermissionState> {
  try {
    return fromExpoPermission(await requestPermissionsAsync(false, GRANULAR));
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }
}

/**
 * A URI expo-image can display for a media library asset. On iOS the `ph://` scheme lets
 * expo-image load a right-sized image straight from Photos; Android needs the asset's content URI.
 */
export async function getAssetImageUri(assetId: string): Promise<string> {
  if (Platform.OS === 'ios') {
    return `ph://${assetId}`;
  }
  try {
    return await new Asset(assetId).getUri();
  } catch (error) {
    throw toServiceError(error, 'not_found');
  }
}

export interface PhotoImportResult {
  entries: ImportedEntry[];
  /** Assets with no capture time; they can't be placed on the timeline. */
  skippedNoTimestamp: number;
  /** Photos folded into a burst's kept shot. */
  collapsedInBursts: number;
}

/**
 * Reads every photo and video captured inside the range, with its GPS location when the file has
 * one, and collapses bursts. Requires photo permission (`granted` or `limited`).
 */
export async function importPhotos(range: ImportRange): Promise<PhotoImportResult> {
  let metadata: AssetMetadata[];
  try {
    metadata = await queryAllMedia(range);
  } catch (error) {
    throw toServiceError(error, 'platform_unavailable');
  }

  const entries: ImportedEntry[] = [];
  let skippedNoTimestamp = 0;
  for (let start = 0; start < metadata.length; start += PAGE_SIZE) {
    const page = metadata.slice(start, start + PAGE_SIZE);
    const locations = await Promise.all(page.map((item) => readLocation(item.id)));
    page.forEach((item, index) => {
      const entry = toImportedEntry(item, locations[index] ?? null);
      if (entry) {
        entries.push(entry);
      } else {
        skippedNoTimestamp += 1;
      }
    });
  }

  const collapsed = collapseBursts(entries);
  return {
    entries: collapsed,
    skippedNoTimestamp,
    collapsedInBursts: entries.length - collapsed.length,
  };
}

/** Pages through the library so very large trips don't load in one native call. */
async function queryAllMedia(range: ImportRange): Promise<AssetMetadata[]> {
  const results: AssetMetadata[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await new Query()
      .gte(AssetField.CREATION_TIME, range.start.getTime())
      .lte(AssetField.CREATION_TIME, range.end.getTime())
      .within(AssetField.MEDIA_TYPE, [MediaType.IMAGE, MediaType.VIDEO])
      .orderBy({ key: AssetField.CREATION_TIME, ascending: true })
      .limit(PAGE_SIZE)
      .offset(offset)
      .exeForMetadata();
    results.push(...page);
    if (page.length < PAGE_SIZE) {
      return results;
    }
  }
}

/**
 * A missing or unreadable location is normal (location off in Camera, screenshots, downloads),
 * so failures here are logged and the photo is imported without a location.
 */
async function readLocation(assetId: string): Promise<GeoPoint | null> {
  try {
    const location = await new Asset(assetId).getLocation();
    return location ? { lat: location.latitude, lng: location.longitude } : null;
  } catch (error) {
    logger.warn('Could not read photo location', error);
    return null;
  }
}

function toImportedEntry(item: AssetMetadata, location: GeoPoint | null): ImportedEntry | null {
  if (item.creationTime === null) {
    return null;
  }
  const isVideo = item.mediaType === MediaType.VIDEO;
  return {
    type: isVideo ? 'video' : 'photo',
    source: 'automatic',
    externalId: `media:${item.id}`,
    // The media library reports both capture time and duration in milliseconds.
    timestamp: new Date(item.creationTime),
    durationMs: isVideo ? item.duration : null,
    location,
    payload: {
      assetId: item.id,
      filename: item.filename,
      width: item.width,
      height: item.height,
      isFavorite: item.isFavorite,
    },
  };
}

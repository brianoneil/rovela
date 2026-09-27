import type { Geofence } from './geo';

export interface Trip {
  id: string;
  name: string;
  startAt: Date;
  /** Null while the trip is still active. */
  endAt: Date | null;
  homeGeofence: Geofence | null;
  destinations: string[];
  /** Reference to the cover photo (media library asset id). Null until one is chosen. */
  coverImageRef: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Fields the user provides when creating a trip. */
export interface TripInput {
  name: string;
  startAt: Date;
  endAt: Date | null;
  homeGeofence?: Geofence | null;
  destinations?: string[];
  coverImageRef?: string | null;
  tags?: string[];
}

/** Fields the user can change on an existing trip. Omitted fields are left unchanged. */
export type TripUpdate = Partial<TripInput>;

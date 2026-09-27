/** A captured position. Altitude and accuracy are in meters and only present when the source reports them. */
export interface GeoPoint {
  lat: number;
  lng: number;
  altitude?: number;
  accuracy?: number;
}

/** A circular area used to detect leaving and returning home. */
export interface Geofence {
  lat: number;
  lng: number;
  radiusMeters: number;
}

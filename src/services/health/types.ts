/** One GPS point of a workout route, stored compactly in the workout entry's payload. */
export interface RoutePoint {
  lat: number;
  lng: number;
  altitude?: number;
  /** Milliseconds since the epoch. */
  timestamp: number;
}

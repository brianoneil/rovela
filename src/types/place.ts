import type { GeoPoint } from './geo';

/**
 * TODO: Finalize the category list; these come from the examples in docs/01 (restaurant, trail,
 * hotel, trailhead, hostel, market).
 */
export const PLACE_CATEGORIES = [
  'restaurant',
  'trail',
  'trailhead',
  'hotel',
  'hostel',
  'market',
  'other',
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  location: GeoPoint;
  createdAt: Date;
}

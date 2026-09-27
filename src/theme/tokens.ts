/**
 * Design tokens mirrored from the Paper file "Rovela" (Paper tokens are the source of truth).
 * When tokens change in Paper, re-read them with Paper's `get_tokens` and update this file.
 * Do not hand-pick values anywhere else in the app.
 *
 * Paper stores sizes in px; React Native uses unitless density-independent points (1px = 1pt).
 * Letter spacing in Paper is em-based, so it is kept as an em ratio and resolved per font size
 * in `typography.ts`.
 */

export const colors = {
  ground: '#0E1318',
  surface: '#161D24',
  line: '#25303A',
  text: '#EEF1EE',
  textMuted: '#9AA6AE',
  accent: '#F4A340',
  onAccent: '#1A1206',
  map: '#121A21',
  topo: '#1F2A33',
} as const;

/** Day track colors, in trip-day order (day 1 first). */
export const dayColors = ['#8CC8E0', '#C39BD3', '#9CCB7A', '#E88FA0', '#E8C15A'] as const;

export const fontFamilyNames = {
  serif: 'Newsreader',
  sans: 'Inter Tight',
} as const;

export const fontSize = {
  label: 11,
  caption: 13,
  body: 15,
  lead: 17,
  quote: 20,
  title: 28,
  display: 40,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

/** Letter spacing as a multiple of font size (Paper em values). */
export const trackingEm = {
  tight: -0.02,
  caps: 0.12,
} as const;

export const lineHeight = {
  caption: 18,
  body: 22,
  quote: 28,
  display: 42,
} as const;

export const opacity = {
  muted: 0.6,
} as const;

export const breakpoint = {
  phone: 390,
  tablet: 834,
} as const;

export const container = {
  reading: 640,
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  full: 999,
} as const;

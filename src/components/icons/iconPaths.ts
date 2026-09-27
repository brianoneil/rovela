/** Stroke icon paths from the Paper designs, drawn on a 24 × 24 grid. */
export const iconPaths = {
  plus: ['M12 5v14M5 12h14'],
  chevronRight: ['M9 6l6 6-6 6'],
  camera: [
    'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
    'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  ],
} as const;

export type IconName = keyof typeof iconPaths;

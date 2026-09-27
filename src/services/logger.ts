/**
 * Central logging so error reporting can be swapped in later without touching call sites.
 * TODO: Forward errors to a crash reporter once one is chosen (no trip data in reports).
 */
export const logger = {
  error(message: string, error?: unknown): void {
    console.error(`[Rovela] ${message}`, error);
  },
  warn(message: string, detail?: unknown): void {
    console.warn(`[Rovela] ${message}`, detail);
  },
};

export const HEALTH_SOURCES = ['healthkit', 'health_connect'] as const;

export type HealthSource = (typeof HEALTH_SOURCES)[number];

/**
 * Daily step total for one local calendar day of a trip, as reported by the health store.
 * Stored separately from timeline entries because it is a per-day total, not a moment in time.
 */
export interface DailyActivity {
  tripId: string;
  /** Local calendar day, `YYYY-MM-DD`. */
  date: string;
  steps: number;
  source: HealthSource;
  updatedAt: Date;
}

export const tripKeys = {
  all: ['trips'] as const,
  list: () => [...tripKeys.all, 'list'] as const,
  detail: (tripId: string) => [...tripKeys.all, 'detail', tripId] as const,
  timeline: (tripId: string) => [...tripKeys.all, 'timeline', tripId] as const,
  dailyActivity: (tripId: string) => [...tripKeys.all, 'dailyActivity', tripId] as const,
  entriesByType: (type: string) => [...tripKeys.all, 'entriesByType', type] as const,
};

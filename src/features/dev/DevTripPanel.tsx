import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useTripImport } from '@/features/import/useTripImport';
import { useDailyActivity, useDeleteTrip, useTimelineEntries } from '@/features/trips/useTrips';
import type { ImportSourceOutcome } from '@/services/import/types';
import { colors, radius, spacing } from '@/theme';
import type { TimelineEntry, Trip } from '@/types';

import { DevButton } from './DevButton';

/**
 * Runs an import for one trip and shows raw counts, to verify the data layer on a device.
 * TODO: Remove with the dev harness once the designed Import screen exists.
 */
export function DevTripPanel({ trip }: { trip: Trip }) {
  const timeline = useTimelineEntries(trip.id);
  const activity = useDailyActivity(trip.id);
  const runImport = useTripImport();
  const removeTrip = useDeleteTrip();

  const totalSteps = activity.data?.reduce((sum, day) => sum + day.steps, 0);

  return (
    <View style={styles.panel}>
      <AppText variant="body">{trip.name}</AppText>
      <AppText variant="caption">
        {trip.startAt.toLocaleString()} → {trip.endAt ? trip.endAt.toLocaleString() : 'active'}
      </AppText>

      <View style={styles.actions}>
        <DevButton
          label={runImport.isPending ? 'Importing…' : 'Run import'}
          onPress={() => runImport.mutate({ trip })}
          disabled={runImport.isPending}
        />
        <DevButton
          label="Delete trip"
          onPress={() => removeTrip.mutate(trip.id)}
          disabled={removeTrip.isPending}
        />
      </View>

      {runImport.error ? (
        <AppText variant="caption">Import error: {runImport.error.userMessage}</AppText>
      ) : null}
      {runImport.data?.outcomes.map((outcome) => (
        <AppText key={outcome.source} variant="caption">
          {describeOutcome(outcome)}
        </AppText>
      ))}

      <AppText variant="label">Timeline</AppText>
      <AppText variant="caption">
        {timeline.error
          ? `error: ${timeline.error.userMessage}`
          : timeline.data
            ? describeCounts(timeline.data)
            : 'loading…'}
      </AppText>
      <AppText variant="caption">
        {activity.error
          ? `steps error: ${activity.error.userMessage}`
          : `step days: ${activity.data?.length ?? 0}, total steps: ${totalSteps ?? 0}`}
      </AppText>
    </View>
  );
}

function describeOutcome(outcome: ImportSourceOutcome): string {
  switch (outcome.status) {
    case 'imported':
      return `${outcome.source}: found ${outcome.found}, added ${outcome.added}, already had ${outcome.skipped}`;
    case 'failed':
      return `${outcome.source}: failed (${outcome.error.code}) ${outcome.error.message}`;
    default:
      return `${outcome.source}: ${outcome.status}`;
  }
}

function describeCounts(entries: TimelineEntry[]): string {
  if (entries.length === 0) {
    return 'no entries';
  }
  const counts = new Map<string, number>();
  let located = 0;
  for (const entry of entries) {
    counts.set(entry.type, (counts.get(entry.type) ?? 0) + 1);
    if (entry.location) located += 1;
  }
  const byType = [...counts].map(([type, count]) => `${type} ${count}`).join(', ');
  return `${entries.length} entries (${byType}); ${located} with location`;
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing[2],
    padding: spacing[4],
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginVertical: spacing[2],
  },
});

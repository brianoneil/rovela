import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import {
  useImportPermission,
  useRequestImportPermission,
} from '@/features/import/useImportPermissions';
import type { ImportSource } from '@/services/import/types';
import { spacing } from '@/theme';

import { DevButton } from './DevButton';

/**
 * Shows one source's permission state with a button to trigger the system prompt.
 * TODO: Remove with the dev harness; real prompts come from the onboarding designs.
 */
export function DevPermissionRow({ source }: { source: ImportSource }) {
  const permission = useImportPermission(source);
  const request = useRequestImportPermission(source);

  const state = permission.error
    ? `error: ${permission.error.userMessage}`
    : (permission.data ?? 'checking…');

  return (
    <View style={styles.row}>
      <AppText variant="body" style={styles.text}>
        {source}: {request.error ? `error: ${request.error.userMessage}` : state}
      </AppText>
      <DevButton
        label={`Ask ${source}`}
        onPress={() => request.mutate()}
        disabled={request.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  text: {
    flex: 1,
  },
});

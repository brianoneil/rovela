import { Pressable, StyleSheet, View } from 'react-native';

import { colors, opacity, radius, spacing } from '@/theme';

import { AppText } from './AppText';

interface ErrorStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Full-area error message with an optional retry-style action. */
export function ErrorState({ title, message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <AppText variant="title">{title}</AppText>
      <AppText variant="caption" style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
        >
          <AppText variant="body" style={styles.actionLabel}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[5],
    backgroundColor: colors.ground,
  },
  message: {
    textAlign: 'center',
  },
  action: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    marginTop: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  actionPressed: {
    opacity: opacity.muted,
  },
  actionLabel: {
    color: colors.onAccent,
  },
});

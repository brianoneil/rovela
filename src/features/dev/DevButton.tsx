import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, opacity, radius, spacing } from '@/theme';

interface DevButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Plain button for developer-only tools.
 * TODO: Remove with the dev harness once the designed Create Trip / Import screens exist.
 */
export function DevButton({ label, onPress, disabled = false }: DevButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dimmed]}
    >
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  dimmed: {
    opacity: opacity.muted,
  },
  label: {
    color: colors.onAccent,
  },
});

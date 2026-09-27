import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StrokeIcon } from '@/components/icons/StrokeIcon';
import { colors, fontFamily, fontSize, opacity, radius } from '@/theme';

/** Tablet header action: "Start a new trip" with the accent plus button. */
export function StartTripPill({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Start a new trip"
      style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
    >
      <Text style={styles.label}>Start a new trip</Text>
      <View style={styles.plus}>
        <StrokeIcon name="plus" size={18} color={colors.onAccent} strokeWidth={2.4} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 18,
    paddingRight: 8,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.full,
  },
  pressed: {
    opacity: opacity.muted,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.body,
    lineHeight: 18,
    color: colors.text,
  },
  plus: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
});

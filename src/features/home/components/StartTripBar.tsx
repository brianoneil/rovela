import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StrokeIcon } from '@/components/icons/StrokeIcon';
import { colors, fontFamily, fontSize, opacity, radius } from '@/theme';

import { homeText } from './homeText';

interface StartTripBarProps {
  onPress: () => void;
  /** Distance from the bottom of the screen. */
  bottom: number;
}

/** Phone: floating "Start a new trip" bar pinned above the home indicator. */
export function StartTripBar({ onPress, bottom }: StartTripBarProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Start a new trip"
      accessibilityHint="Or rebuild one from your camera roll"
      style={({ pressed }) => [styles.bar, { bottom }, pressed && styles.pressed]}
    >
      <View style={styles.text}>
        <Text style={styles.title}>Start a new trip</Text>
        <Text style={homeText.smallMeta}>Or rebuild one from your camera roll</Text>
      </View>
      <View style={styles.plus}>
        <StrokeIcon name="plus" size={22} color={colors.onAccent} strokeWidth={2.4} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingLeft: 20,
    paddingRight: 8,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.full,
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.45)',
  },
  pressed: {
    opacity: opacity.muted,
  },
  text: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.body,
    lineHeight: 18,
    color: colors.text,
  },
  plus: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
});

import { Pressable, StyleSheet, Text } from 'react-native';

import { StrokeIcon } from '@/components/icons/StrokeIcon';
import { colors, opacity, radius } from '@/theme';

import { homeText } from './homeText';

interface RebuildTripTileProps {
  width: number;
  onPress: () => void;
}

/** Tablet: dashed tile at the end of "Your trips" for rebuilding a trip from existing data. */
export function RebuildTripTile({ width, onPress }: RebuildTripTileProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Rebuild a past trip from your camera roll"
      style={({ pressed }) => [styles.tile, { width }, pressed && styles.pressed]}
    >
      <StrokeIcon name="camera" size={22} color={colors.textMuted} />
      <Text style={[homeText.meta, styles.text]}>
        {'Rebuild a past trip\nfrom your camera roll'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderColor: colors.line,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.md,
  },
  pressed: {
    opacity: opacity.muted,
  },
  text: {
    textAlign: 'center',
  },
});

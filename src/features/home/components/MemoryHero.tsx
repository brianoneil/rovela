import { Canvas, Fill, LinearGradient, vec } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAssetImageUri } from '@/features/trips/useAssetImageUri';
import { colors, fontFamily, opacity, withAlpha } from '@/theme';

import { formatYearsAgo, type TripMemory } from '../tripMemory';
import type { MemoryDetails } from '../useHomeData';
import { homeText } from './homeText';

interface MemoryHeroProps {
  memory: TripMemory;
  details: MemoryDetails;
  variant: 'phone' | 'tablet';
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const VARIANTS = {
  phone: { radius: 20, gradientHeight: 170, padding: 20, gap: 6, titleSize: 26, titleLine: 30 },
  tablet: { radius: 24, gradientHeight: 200, padding: 28, gap: 8, titleSize: 36, titleLine: 40 },
} as const;

/**
 * "On this day" card: a photo from the same day of a past trip, the trip name, and real counts.
 * Without a photo the card stays on the map color rather than showing a stand-in image.
 */
export function MemoryHero({ memory, details, variant, onPress, style }: MemoryHeroProps) {
  const v = VARIANTS[variant];
  const imageUri = useAssetImageUri(details.heroAssetId);

  const metaParts = [`Day ${memory.dayNumber}`];
  if (details.photoCount > 0) {
    metaParts.push(`${details.photoCount} ${details.photoCount === 1 ? 'photo' : 'photos'}`);
  }
  if (variant === 'tablet') {
    metaParts.push('Tap to open that day');
  }
  const label = formatYearsAgo(memory.yearsAgo);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${memory.trip.name}, ${metaParts.join(', ')}`}
      style={({ pressed }) => [
        styles.card,
        { borderRadius: v.radius },
        style,
        pressed && styles.pressed,
      ]}
    >
      {imageUri.data ? (
        <Image
          source={{ uri: imageUri.data }}
          contentFit="cover"
          transition={200}
          style={StyleSheet.absoluteFill}
          accessible={false}
        />
      ) : null}
      <Canvas
        style={[styles.gradient, { height: v.gradientHeight }]}
        pointerEvents="none"
        accessible={false}
      >
        <Fill>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, v.gradientHeight)}
            colors={[withAlpha(colors.ground, 0), withAlpha(colors.ground, 0.92)]}
          />
        </Fill>
      </Canvas>
      <View style={{ padding: v.padding, gap: v.gap }}>
        <Text style={[homeText.capsLabel, styles.label]}>{label}</Text>
        <Text
          style={[styles.title, { fontSize: v.titleSize, lineHeight: v.titleLine }]}
          numberOfLines={2}
        >
          {memory.trip.name}
        </Text>
        <Text style={homeText.meta}>{metaParts.join(' · ')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: colors.map,
  },
  pressed: {
    opacity: opacity.muted,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  label: {
    color: colors.accent,
  },
  title: {
    fontFamily: fontFamily.serifRegular,
    color: colors.text,
  },
});

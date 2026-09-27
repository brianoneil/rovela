import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { projectRoute, type TripRoutePoint } from '@/features/trips/tripRoute';
import { colors, getDayColor, radius } from '@/theme';

interface RouteThumbnailProps {
  route: TripRoutePoint[];
  strokeWidth: number;
  style?: StyleProp<ViewStyle>;
}

// Keeps the line clear of the tile's rounded corners.
const PADDING = 16;

/**
 * Map-colored tile with the trip's path drawn in day colors. The tile size comes from layout,
 * so the same component works in fixed phone cards and flexible tablet grids. A trip with fewer
 * than two known positions shows the empty tile — no path is invented.
 */
export function RouteThumbnail({ route, strokeWidth, style }: RouteThumbnailProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const paths = useMemo(() => {
    if (!size) {
      return [];
    }
    return projectRoute(route, size.width, size.height, PADDING).map((segment) => {
      const path = Skia.Path.Make();
      segment.points.forEach((point, index) => {
        if (index === 0) path.moveTo(point.x, point.y);
        else path.lineTo(point.x, point.y);
      });
      return { path, color: getDayColor(segment.day) };
    });
  }, [route, size]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((current) =>
      current && current.width === width && current.height === height ? current : { width, height },
    );
  };

  return (
    <View style={[styles.tile, style]} onLayout={handleLayout}>
      {size && paths.length > 0 ? (
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          {paths.map(({ path, color }, index) => (
            <Path
              key={index}
              path={path}
              style="stroke"
              color={color}
              strokeWidth={strokeWidth}
              strokeCap="round"
              strokeJoin="round"
            />
          ))}
        </Canvas>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.map,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
});

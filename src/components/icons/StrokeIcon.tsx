import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';

import { iconPaths, type IconName } from './iconPaths';

interface StrokeIconProps {
  name: IconName;
  size: number;
  color: string;
  strokeWidth?: number;
}

const GRID = 24;

/** Line icon from the design's 24-unit grid, scaled to `size`. Decorative: hidden from screen readers. */
export function StrokeIcon({ name, size, color, strokeWidth = 2 }: StrokeIconProps) {
  const paths = useMemo(
    () =>
      iconPaths[name].map((d) => {
        const path = Skia.Path.MakeFromSVGString(d);
        if (!path) {
          throw new Error(`Invalid icon path for "${name}"`);
        }
        return path;
      }),
    [name],
  );

  return (
    <Canvas style={{ width: size, height: size }} pointerEvents="none" accessible={false}>
      <Group transform={[{ scale: size / GRID }]}>
        {paths.map((path, index) => (
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
      </Group>
    </Canvas>
  );
}

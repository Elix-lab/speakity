import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { borders, colors, motion, radii, sizes, type ColorToken } from '@/theme';

type ProgressBarProps = {
  /** 0..1 */
  value: number;
  color?: ColorToken;
  style?: StyleProp<ViewStyle>;
};

const [x1, y1, x2, y2] = motion.progress.bezier;

/** .progress — 14px track, white, 2px ink border, leaf fill. */
export function ProgressBar({ value, color = 'leaf', style }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const [width] = useState(() => new Animated.Value(clamped));

  useEffect(() => {
    Animated.timing(width, {
      toValue: clamped,
      duration: motion.progress.duration,
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver: false,
    }).start();
  }, [clamped, width]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, style]}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: colors[color],
            width: width.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
              // the bezier overshoots (y1 = 1.3); keep it inside the track
              extrapolate: 'clamp',
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: sizes.progress,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
    overflow: 'hidden',
  },
  fill: { height: '100%' },
});

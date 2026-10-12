import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors, motion } from '@/theme';

const { duration, stagger, liftY, minOpacity } = motion.thinkDot;
const [a, b, c, d] = motion.easeInOut;
const easeInOut = Easing.bezier(a, b, c, d);

/**
 * .think-dots — replaces the waveform while Monty is thinking (network
 * round trip, no live audio to show).
 * keyframes thinkDot (1.3s ease-in-out infinite, delays 0/.18/.36s):
 *   0%, 80%, 100% → opacity .3, y 0
 *   40%           → opacity 1,  y -5px
 */
export function ThinkDots() {
  return (
    <View style={styles.row}>
      {[0, 1, 2].map((i) => (
        <Dot key={i} delay={i * stagger} />
      ))}
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const segment = duration * 0.4; // 0→40% and 40→80%
    const anim = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(t, { toValue: 1, duration: segment, easing: easeInOut, useNativeDriver: true }),
          Animated.timing(t, { toValue: 0, duration: segment, easing: easeInOut, useNativeDriver: true }),
          Animated.delay(duration - 2 * segment), // 80→100% holds at rest
        ]),
      ),
    ]);
    anim.start();
    return () => anim.stop();
  }, [delay, t]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: t.interpolate({ inputRange: [0, 1], outputRange: [minOpacity, 1] }),
          transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, liftY] }) }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // .think-dots: gap 7, height 40
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 40 },
  // .think-dots i: 8px ink circles
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ink },
});

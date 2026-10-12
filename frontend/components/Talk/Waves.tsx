import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors, motion } from '@/theme';

const { count, restHeight, minPeak, peakRange, minDur, durRange, maxPhase } = motion.bar;
const [a, b, c, d] = motion.easeInOut;
const easeInOut = Easing.bezier(a, b, c, d);

// keyframes bar { 0%,100%: 7px · 50%: --h }, ease-in-out applies to each
// half. A looping 0→1 value is mapped through a sampled curve so the
// random negative delay can start each bar mid-cycle.
const SAMPLES = 10;
const inputRange: number[] = [];
const curve: number[] = [];
for (let i = 0; i <= SAMPLES; i++) {
  const t = i / SAMPLES;
  inputRange.push(t / 2);
  curve.push(easeInOut(t));
}
for (let i = 1; i <= SAMPLES; i++) {
  const t = i / SAMPLES;
  inputRange.push(0.5 + t / 2);
  curve.push(1 - easeInOut(t));
}

/** .waves — 21 ink bars; animated while Monty speaks or while you talk. */
export function Waves({ active }: { active: boolean }) {
  // Per-bar randomness, like the prototype's inline --h / --d / --dl.
  const [bars] = useState(() =>
    Array.from({ length: count }, () => ({
      peak: minPeak + Math.floor(Math.random() * peakRange),
      duration: minDur + Math.random() * durRange,
      phase: Math.random() * maxPhase,
    })),
  );

  return (
    <View style={styles.waves}>
      {bars.map((bar, i) => (
        <Bar key={i} {...bar} active={active} />
      ))}
    </View>
  );
}

function Bar({
  peak,
  duration,
  phase,
  active,
}: {
  peak: number;
  duration: number;
  phase: number;
  active: boolean;
}) {
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!active) {
      t.stopAnimation();
      t.setValue(0);
      return;
    }
    // start mid-cycle (negative animation-delay), then loop
    const start = (phase % duration) / duration;
    t.setValue(start);
    const first = Animated.timing(t, {
      toValue: 1,
      duration: duration * (1 - start),
      easing: Easing.linear,
      useNativeDriver: false,
    });
    const loop = Animated.loop(
      Animated.timing(t, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: false }),
      { resetBeforeIteration: true },
    );
    const anim = Animated.sequence([first, Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: false }), loop]);
    anim.start();
    return () => anim.stop();
  }, [active, duration, phase, t]);

  const height = t.interpolate({
    inputRange,
    outputRange: curve.map((v) => restHeight + v * (peak - restHeight)),
  });

  return <Animated.View style={[styles.bar, { height, opacity: active ? 0.8 : 0.35 }]} />;
}

const styles = StyleSheet.create({
  // .waves: gap 4, height 40
  waves: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, height: 40 },
  // .bar: 5px wide, 7px tall at rest, radius 3, ink
  bar: { width: 5, borderRadius: 3, backgroundColor: colors.ink },
});

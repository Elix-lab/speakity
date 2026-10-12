import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Image, type ImageSourcePropType } from 'react-native';

import { motion } from '@/theme';

/**
 * Mia's poses. talk/listen/think share the same canvas (1199×1312) with Mia
 * aligned in the same spot, so switching poses never shifts her or the
 * layout. ask/idle/recap are the prototype's own images (ASK_MASCOT,
 * MASCOT, RECAP_MASCOT) at their own sizes.
 */
const POSES = {
  talk: { source: require('@/assets/images/mia/talk.webp'), width: 1199, height: 1312 },
  listen: { source: require('@/assets/images/mia/listen.webp'), width: 1199, height: 1312 },
  think: { source: require('@/assets/images/mia/think.webp'), width: 1199, height: 1312 },
  ask: { source: require('@/assets/images/mia/ask.webp'), width: 447, height: 480 },
  idle: { source: require('@/assets/images/mia/idle.webp'), width: 385, height: 480 },
  recap: { source: require('@/assets/images/mia/recap.webp'), width: 520, height: 471 },
} satisfies Record<string, { source: ImageSourcePropType; width: number; height: number }>;

export type MiaPose = keyof typeof POSES;

/**
 * - idle → @keyframes idle, 3.4s ease-in-out infinite (.pc-mia, .due-card .mia)
 * - chat → @keyframes chat, 1s ease-in-out × 3 (.done-mia)
 * transform-origin 50% 100% (.mia).
 */
export type MascotAnimation = 'idle' | 'chat';

type MascotProps = {
  pose: MiaPose;
  width: number;
  animation?: MascotAnimation;
};

const [a, b, c, d] = motion.easeInOut;
const easeInOut = Easing.bezier(a, b, c, d);

/** Mia exactly as the image file comes — no outline added. */
export function Mascot({ pose, width, animation }: MascotProps) {
  const p = POSES[pose];
  const height = (width * p.height) / p.width;
  const image = (
    <Image source={p.source} style={{ width, height }} accessibilityIgnoresInvertColors />
  );
  if (!animation) return image;
  return (
    <MascotMotion height={height} animation={animation}>
      {image}
    </MascotMotion>
  );
}

function MascotMotion({
  animation,
  height,
  children,
}: {
  animation: MascotAnimation;
  height: number;
  children: ReactNode;
}) {
  return <Animated.View style={useMascotAnimation(animation, height)}>{children}</Animated.View>;
}

function useMascotAnimation(animation: MascotAnimation, height: number) {
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const anim =
      animation === 'idle'
        ? // 0% → 50% → 100%, ease-in-out per keyframe segment
          Animated.loop(
            Animated.sequence([
              Animated.timing(t, { toValue: 1, duration: motion.idle.duration / 2, easing: easeInOut, useNativeDriver: true }),
              Animated.timing(t, { toValue: 0, duration: motion.idle.duration / 2, easing: easeInOut, useNativeDriver: true }),
            ]),
          )
        : // keyframes at 0 / 30 / 60 / 100%, mapped onto t = 0 / 1 / 2 / 3
          Animated.loop(
            Animated.sequence([
              Animated.timing(t, { toValue: 1, duration: motion.chat.duration * 0.3, easing: easeInOut, useNativeDriver: true }),
              Animated.timing(t, { toValue: 2, duration: motion.chat.duration * 0.3, easing: easeInOut, useNativeDriver: true }),
              Animated.timing(t, { toValue: 3, duration: motion.chat.duration * 0.4, easing: easeInOut, useNativeDriver: true }),
              Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: true }),
            ]),
            { iterations: motion.chat.iterations },
          );
    anim.start();
    return () => anim.stop();
  }, [animation, t]);

  // RN rotates/scales around the center; shift by half the height so the
  // pivot is the bottom center (transform-origin: 50% 100%).
  const half = height / 2;
  if (animation === 'idle') {
    // idle: 0/100% rotate(-2deg) y 0 · 50% rotate(2deg) y -4px
    return {
      transform: [
        { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) },
        { translateY: half },
        { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] }) },
        { translateY: -half },
      ],
    };
  }
  // chat: 0/100% y 0 scale(1,1) · 30% y -12px scale(.98,1.03) · 60% y 0 scale(1.04,.96)
  const range = [0, 1, 2, 3];
  return {
    transform: [
      { translateY: t.interpolate({ inputRange: range, outputRange: [0, -12, 0, 0] }) },
      { translateY: half },
      { scaleX: t.interpolate({ inputRange: range, outputRange: [1, 0.98, 1.04, 1] }) },
      { scaleY: t.interpolate({ inputRange: range, outputRange: [1, 1.03, 0.96, 1] }) },
      { translateY: -half },
    ],
  };
}

import { Image, type ImageSourcePropType } from 'react-native';

/**
 * Monty's poses. talk/listen/think/shrug/holdingCard share the same canvas (1199×1312) with Monty
 * aligned in the same spot, so switching poses never shifts him or the
 * layout. ask/idle/recap are the prototype's own images (ASK_MASCOT,
 * MASCOT, RECAP_MASCOT) at their own sizes.
 */
const POSES = {
  talk: { source: require('@/assets/images/monty/talk.webp'), width: 1199, height: 1312 },
  listen: { source: require('@/assets/images/monty/listen.webp'), width: 1199, height: 1312 },
  think: { source: require('@/assets/images/monty/think.webp'), width: 1199, height: 1312 },
  shrug: { source: require('@/assets/images/monty/shrug.webp'), width: 1199, height: 1312 },
  holdingCard: { source: require('@/assets/images/monty/holding-card.png'), width: 1199, height: 1312 },
  ask: { source: require('@/assets/images/monty/ask.webp'), width: 447, height: 480 },
  idle: { source: require('@/assets/images/monty/idle.webp'), width: 385, height: 480 },
  recap: { source: require('@/assets/images/monty/recap.webp'), width: 520, height: 471 },
} satisfies Record<string, { source: ImageSourcePropType; width: number; height: number }>;

export type MontyPose = keyof typeof POSES;

type MascotProps = {
  pose: MontyPose;
  width: number;
};

/**
 * Monty exactly as the image file comes — no outline added. Always a still
 * image: the prototype's mascot animations (idle, chat, pose swap) are
 * intentionally left out.
 */
export function Mascot({ pose, width }: MascotProps) {
  const p = POSES[pose];
  const height = (width * p.height) / p.width;
  return <Image source={p.source} style={{ width, height }} accessibilityIgnoresInvertColors />;
}

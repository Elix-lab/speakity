import { Image, type ImageSourcePropType } from 'react-native';

/**
 * Mia's poses. All share the same canvas (1199×1312) with Mia aligned in
 * the same spot, so switching poses never shifts her or the layout.
 */
const POSE_SIZE = { width: 1199, height: 1312 };

export const miaPoses = {
  talk: require('@/assets/images/mia/talk.webp'),
  listen: require('@/assets/images/mia/listen.webp'),
  think: require('@/assets/images/mia/think.webp'),
} satisfies Record<string, ImageSourcePropType>;

export type MiaPose = keyof typeof miaPoses;

type MascotProps = {
  pose: MiaPose;
  width: number;
};

/** Mia exactly as the image file comes — no outline, no animation. */
export function Mascot({ pose, width }: MascotProps) {
  return (
    <Image
      source={miaPoses[pose]}
      style={{ width, height: (width * POSE_SIZE.height) / POSE_SIZE.width }}
      accessibilityIgnoresInvertColors
    />
  );
}

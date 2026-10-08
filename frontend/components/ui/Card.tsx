import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  borders,
  colors,
  radii,
  sizes,
  spacing,
  tilt as tilts,
  type ColorToken,
  type Tilt,
} from '@/theme';

import { Sticker } from './Sticker';

type CardProps = {
  children?: ReactNode;
  /** `hero` = 24px radius (.win-hero, .due-card); default 22px (.card). */
  hero?: boolean;
  /** Hand-placed rotation: left = -.6deg, right = .5deg. */
  tilt?: Tilt;
  /** Yellow pin in the top-left corner (.win-hero / .practice-card). */
  pin?: boolean;
  background?: ColorToken;
  /** Remove the default 20px padding (e.g. .list rows). */
  flush?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Card({
  children,
  hero = false,
  tilt,
  pin = false,
  background = 'surface',
  flush = false,
  style,
  containerStyle,
}: CardProps) {
  const radius = hero ? radii.hero : radii.card;
  return (
    <View style={[tilt && { transform: [{ rotate: `${tilts[tilt]}deg` }] }, containerStyle]}>
      <Sticker
        pop="md"
        radius={radius}
        style={[
          styles.face,
          { backgroundColor: colors[background] },
          !flush && { padding: spacing.cardPadding },
          style,
        ]}>
        {children}
      </Sticker>
      {pin && <Pin />}
    </View>
  );
}

/**
 * .win-hero::before — top:-9px left:28px, 16px sun circle, 2px ink border,
 * 1px 1px 0 ink shadow. Rendered outside the face so overflow:hidden
 * content can't clip it.
 */
function Pin() {
  return (
    <View pointerEvents="none" style={styles.pinWrap}>
      <View style={[styles.pin, styles.pinShadow]} />
      <View style={styles.pin} />
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    borderWidth: borders.default,
    borderColor: colors.ink,
  },
  pinWrap: {
    position: 'absolute',
    top: -9,
    left: 28,
    width: sizes.pin,
    height: sizes.pin,
    zIndex: 2,
  },
  pin: {
    position: 'absolute',
    width: sizes.pin,
    height: sizes.pin,
    borderRadius: sizes.pin / 2,
    backgroundColor: colors.sun,
    borderWidth: borders.default,
    borderColor: colors.ink,
  },
  pinShadow: {
    top: 1,
    left: 1,
    backgroundColor: colors.ink,
  },
});

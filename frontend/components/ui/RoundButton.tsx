import type { ReactNode } from 'react';
import { StyleSheet, type PressableProps } from 'react-native';

import { borders, colors, sizes } from '@/theme';

import { PressableSticker } from './Sticker';

type RoundButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  /** .round.on — coral fill (e.g. paused). */
  on?: boolean;
};

/** .round — 44px circle, 2px ink border, 2px pop shadow. */
export function RoundButton({ children, on = false, ...props }: RoundButtonProps) {
  return (
    <PressableSticker
      {...props}
      accessibilityRole="button"
      pop="sm"
      radius={sizes.round / 2}
      style={[styles.face, on && styles.on]}>
      {children}
    </PressableSticker>
  );
}

const styles = StyleSheet.create({
  face: {
    width: sizes.round,
    height: sizes.round,
    borderWidth: borders.default,
    borderColor: colors.ink,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  on: { backgroundColor: colors.coral },
});

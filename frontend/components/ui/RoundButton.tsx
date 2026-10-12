import type { ReactNode } from 'react';
import { StyleSheet, type PressableProps } from 'react-native';

import { borders, colors, sizes } from '@/theme';

import { PressableSticker } from './Sticker';

type RoundButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  /** .round.on — coral fill (e.g. paused). */
  on?: boolean;
  /** Diameter. 44 by default; 38 in the date range (.date-range .round). */
  size?: number;
};

/**
 * .round — circle, 2px ink border, 2px pop shadow. Disabled keeps its
 * shadow and fades to .35 (.pager .round:disabled).
 */
export function RoundButton({ children, on = false, size = sizes.round, disabled, ...props }: RoundButtonProps) {
  return (
    <PressableSticker
      {...props}
      disabled={disabled}
      shadowWhenDisabled
      accessibilityRole="button"
      accessibilityState={{ ...props.accessibilityState, disabled: !!disabled }}
      pop="sm"
      radius={size / 2}
      containerStyle={disabled && styles.disabled}
      style={[styles.face, { width: size, height: size }, on && styles.on]}>
      {children}
    </PressableSticker>
  );
}

const styles = StyleSheet.create({
  face: {
    borderWidth: borders.default,
    borderColor: colors.ink,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  on: { backgroundColor: colors.coral },
  disabled: { opacity: 0.35 },
});

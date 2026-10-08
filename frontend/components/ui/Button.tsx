import type { ReactNode } from 'react';
import { StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { borders, colors, radii, sizes, spacing, type ColorToken, type PopSize } from '@/theme';

import { PressableSticker } from './Sticker';
import { Text } from './Text';

/**
 * Variants map to the prototype's .btn modifiers:
 * - primary → .btn.talk / .btn.sea (leaf, big shadow — the hero action)
 * - sun     → .btn.shell
 * - coral   → .btn.red
 * - ghost   → .btn.ghost
 */
export type ButtonVariant = 'primary' | 'sun' | 'coral' | 'ghost';

const variantStyle: Record<ButtonVariant, { bg: ColorToken; pop: PopSize }> = {
  primary: { bg: 'leaf', pop: 'lg' },
  sun: { bg: 'sun', pop: 'md' },
  coral: { bg: 'coral', pop: 'md' },
  ghost: { bg: 'surface', pop: 'md' },
};

type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: ButtonVariant;
  big?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'ghost',
  big = false,
  icon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const v = variantStyle[variant];
  return (
    <PressableSticker
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      pop={disabled ? null : v.pop}
      radius={radii.button}
      containerStyle={style}
      style={[
        styles.face,
        { height: big ? sizes.buttonBig : sizes.button, backgroundColor: colors[v.bg] },
        disabled && styles.disabled,
      ]}>
      <View style={styles.row}>
        {icon}
        <Text variant={big ? 'buttonBig' : 'button'} color={disabled ? 'disabledInk' : 'ink'}>
          {label}
        </Text>
      </View>
    </PressableSticker>
  );
}

const styles = StyleSheet.create({
  face: {
    borderWidth: borders.default,
    borderColor: colors.ink,
    paddingHorizontal: spacing.buttonPaddingX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.buttonGap,
  },
  disabled: {
    backgroundColor: colors.disabledBg,
    borderColor: colors.disabledInk,
  },
});

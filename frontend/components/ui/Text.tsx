import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, textStyles, type ColorToken, type TextVariant } from '@/theme';

type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: ColorToken;
};

/** Text with a typography token from theme/typography.ts. */
export function Text({ variant = 'body', color, style, ...props }: TextProps) {
  return (
    <RNText style={[textStyles[variant], color && { color: colors[color] }, style]} {...props} />
  );
}

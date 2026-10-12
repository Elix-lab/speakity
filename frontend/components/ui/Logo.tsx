import { Image, StyleSheet, View } from 'react-native';

import { borders, colors } from '@/theme';

import { Sticker } from './Sticker';
import { Text } from './Text';

const head = require('@/assets/images/monty/head.webp');

type LogoProps = {
  /** .mark size (--s). Prototype uses 38 on Home, 30 on the pre-talk topbar. */
  size?: number;
  fontSize?: number;
};

/**
 * .logo — leaf .mark with Monty's head (no sticker outline filter here, the
 * prototype sets `filter:none` on .mark img) + the "Speakity" wordmark,
 * a single block with no trailing dot.
 */
export function Logo({ size = 36, fontSize }: LogoProps) {
  const imgSize = size * 1.22; // .mark img: 122%
  return (
    <View style={styles.row}>
      <Sticker pop="sm" radius={14} style={[styles.mark, { width: size, height: size }]}>
        <Image source={head} style={{ width: imgSize, height: imgSize }} />
      </Sticker>
      <Text variant="logo" style={fontSize ? { fontSize } : undefined}>
        Speakity
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: {
    backgroundColor: colors.leaf,
    borderWidth: borders.default,
    borderColor: colors.ink,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

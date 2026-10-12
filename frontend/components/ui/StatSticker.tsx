import { StyleSheet } from 'react-native';

import { borders, colors } from '@/theme';

import { Sticker } from './Sticker';
import { Text } from './Text';

type StatStickerProps = {
  n: number;
  label: string;
};

/** .stat — small tilted sticker with a big number (end-of-session screens). */
export function StatSticker({ n, label }: StatStickerProps) {
  return (
    <Sticker pop="md" radius={14} tilt="left" containerStyle={styles.wrap} style={styles.stat}>
      <Text variant="stat" style={styles.text}>
        {n}
      </Text>
      <Text variant="caption" style={styles.text}>
        {label}
      </Text>
    </Sticker>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 }, // .stat flex 1 inside .stats
  // .stat: radius 14, padding 12px 8px
  stat: {
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  text: { textAlign: 'center' },
});

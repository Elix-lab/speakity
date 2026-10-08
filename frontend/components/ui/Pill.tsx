import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { borders, colors, radii, type ColorToken, type TextVariant } from '@/theme';

import { Sticker } from './Sticker';
import { Text } from './Text';

/**
 * Three sizes from the prototype:
 * - pill → .pill (streak etc.): display 16px, 2px border, 2px pop shadow
 * - chip → .chip: 13px / 700, 1.5px border, no shadow
 * - tag  → .tag (inline with text): 11px / 700, 1px border, no shadow
 */
export type PillSize = 'pill' | 'chip' | 'chipSm' | 'tag';

const sizeStyle: Record<
  PillSize,
  { text: TextVariant; border: number; px: number; py: number; gap: number; shadow: boolean }
> = {
  pill: { text: 'pill', border: borders.default, px: 12, py: 5, gap: 6, shadow: true },
  chip: { text: 'chip', border: borders.chip, px: 12, py: 5, gap: 6, shadow: false },
  // .chips-sm .chip — compact chip inside list rows
  chipSm: { text: 'chipSm', border: borders.chip, px: 8, py: 2, gap: 6, shadow: false },
  tag: { text: 'tag', border: borders.tag, px: 8, py: 3, gap: 5, shadow: false },
};

type PillProps = {
  label: string;
  size?: PillSize;
  background?: ColorToken;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Pill({ label, size = 'pill', background = 'surface', icon, style }: PillProps) {
  const s = sizeStyle[size];
  return (
    <Sticker
      pop={s.shadow ? 'sm' : null}
      radius={radii.full}
      containerStyle={[styles.container, style]}
      style={{
        backgroundColor: colors[background],
        borderWidth: s.border,
        borderColor: colors.ink,
        paddingHorizontal: s.px,
        paddingVertical: s.py,
      }}>
      <View style={[styles.row, { gap: s.gap }]}>
        {icon}
        <Text variant={s.text}>{label}</Text>
      </View>
    </Sticker>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center' },
});

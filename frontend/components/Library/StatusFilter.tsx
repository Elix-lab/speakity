import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { CARD_STATUS, CARD_STATUS_ORDER, Sticker, Text } from '@/components/ui';
import type { CardStatus } from '@/lib/types';
import { borders, colors, radii } from '@/theme';

type StatusFilterProps = {
  selected: CardStatus[];
  onToggle: (status: CardStatus) => void;
};

/** .fchip-row — one toggle chip per status; active chips are leaf with a 2px pop. */
export function StatusFilter({ selected, onToggle }: StatusFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {CARD_STATUS_ORDER.map((status) => {
        const active = selected.includes(status);
        return (
          <Pressable
            key={status}
            onPress={() => onToggle(status)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => pressed && styles.pressed}>
            <Sticker pop={active ? 'sm' : null} radius={radii.full} style={[styles.chip, active && styles.active]}>
              <Text variant="filterChip">{CARD_STATUS[status].label}</Text>
            </Sticker>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // .fchip-row: gap 8, padding-bottom 2
  row: { gap: 8, paddingBottom: 2, paddingRight: 2 },
  // .fchip: 2px border, pill, padding 6px 13px, surface
  chip: {
    borderWidth: borders.default,
    borderColor: colors.ink,
    paddingVertical: 6,
    paddingHorizontal: 13,
    backgroundColor: colors.surface,
  },
  active: { backgroundColor: colors.leaf }, // .fchip.active
  pressed: { transform: [{ scale: 0.95 }] }, // .fchip:active
});

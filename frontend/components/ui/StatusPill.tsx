import { StyleSheet, View } from 'react-native';

import type { CardStatus } from '@/lib/types';
import { borders, colors, radii, type ColorToken } from '@/theme';

import { Text } from './Text';

/** Card status → label and color (.s-* / .seg-*). Learning uses --sea-soft (= sea). */
export const CARD_STATUS: Record<CardStatus, { label: string; color: ColorToken }> = {
  new: { label: 'New', color: 'new' },
  learning: { label: 'Learning', color: 'sea' },
  mastered: { label: 'Mastered', color: 'ok' },
};

export const CARD_STATUS_ORDER: CardStatus[] = ['new', 'learning', 'mastered'];

/** .status — small pill with the card's status. */
export function StatusPill({ status }: { status: CardStatus }) {
  const s = CARD_STATUS[status];
  return (
    <View style={[styles.pill, { backgroundColor: colors[s.color] }]}>
      <Text variant="statusPill">{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // .status: padding 3px 9px, pill, 1.5px border
  pill: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: radii.full,
    borderWidth: borders.chip,
    borderColor: colors.ink,
  },
});

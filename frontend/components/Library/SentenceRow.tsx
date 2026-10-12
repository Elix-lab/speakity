import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Icon, SentenceCard, StatusPill, Sticker, Text } from '@/components/ui';
import { relativeDay } from '@/lib/format';
import type { Flashcard } from '@/lib/types';
import { borders, colors } from '@/theme';

type SentenceRowProps = {
  card: Flashcard;
  open: boolean;
  onToggle: () => void;
  onListen: () => void;
};

/**
 * .convo.sent — collapsible row: the corrected sentence, when + category,
 * status pill and chevron; opens to the full sentence card.
 */
export function SentenceRow({ card, open, onToggle, onListen }: SentenceRowProps) {
  // .chev: transform .2s → rotate(90deg) when open
  const [turn] = useState(() => new Animated.Value(open ? 1 : 0));
  useEffect(() => {
    Animated.timing(turn, { toValue: open ? 1 : 0, duration: 200, useNativeDriver: true }).start();
  }, [open, turn]);

  return (
    <Sticker pop="md" radius={24} containerStyle={styles.container} style={styles.face}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={styles.summary}>
        <View style={styles.grow}>
          <Text variant="sentenceTitle">{card.better}</Text>
          <Text variant="small" style={styles.meta}>
            {relativeDay(card.createdAt)} · {card.category}
          </Text>
        </View>
        <StatusPill status={card.status} />
        <Animated.View
          style={{ transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }) }] }}>
          <Icon name="chev" size={18} />
        </Animated.View>
      </Pressable>
      {open && (
        <View style={styles.body}>
          <SentenceCard card={card} showEs showIpa showWhy onListen={onListen} />
        </View>
      )}
    </Sticker>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 }, // .convo margin-bottom
  // .convo: surface, 2px border, radius 24, 4px pop
  face: { backgroundColor: colors.surface, borderWidth: borders.default, borderColor: colors.ink },
  // .convo summary: gap 12, padding 14px 16px
  summary: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  grow: { flex: 1, minWidth: 0 },
  meta: { marginTop: 2 }, // .sent summary .small
  // .sent-body: padding 12px 16px 16px, 1px top border
  body: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: borders.tag,
    borderTopColor: colors.ink,
  },
});

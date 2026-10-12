import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Icon, SentenceCard, Sticker, Text } from '@/components/ui';
import type { Flashcard } from '@/lib/types';
import { borders, colors, radii } from '@/theme';

/**
 * .challenge-anchor — "Today's challenge" toggle. The sheet floats above
 * the mascot (absolute overlay) instead of pushing it down.
 */
export function ChallengeToggle({ cards }: { cards: Flashcard[] }) {
  const [open, setOpen] = useState(false);
  const { height } = useWindowDimensions();

  return (
    <View style={styles.anchor}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}>
        <Sticker pop="md" radius={radii.card} style={styles.toggle}>
          {/* <b> + span.small are inline in the prototype, so they flow as one text */}
          <Text variant="strong" style={styles.grow}>
            Today&apos;s challenge{' '}
            <Text variant="small">Tap to see what Monty&apos;s listening for</Text>
          </Text>
          {/* .chev rotates 90° when expanded */}
          <View style={open && styles.chevOpen}>
            <Icon name="chev" size={18} />
          </View>
        </Sticker>
      </Pressable>

      {open && (
        // .challenge-overlay: top calc(100% + 8px), max-height 60vh, z 30
        <View style={styles.overlay}>
          <Sticker pop="lg" radius={radii.card} style={[styles.sheet, { maxHeight: height * 0.6 }]}>
            <ScrollView>
              {cards.map((card) => (
                <SentenceCard key={card.id} card={card} showIpa />
              ))}
            </ScrollView>
          </Sticker>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // .challenge-anchor: margin 0 20px 4px
  anchor: { marginHorizontal: 20, marginBottom: 4, zIndex: 30 },
  // .challenge-toggle: row, gap 12, padding 14px 16px
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
  },
  grow: { flex: 1, minWidth: 0 },
  chevOpen: { transform: [{ rotate: '90deg' }] },
  overlay: { position: 'absolute', top: '100%', marginTop: 8, left: 0, right: 0, zIndex: 30 },
  // .challenge-sheet: padding 16, 6px pop
  sheet: {
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
    padding: 16,
    overflow: 'hidden',
  },
});

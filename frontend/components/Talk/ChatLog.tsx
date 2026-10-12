import { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import type { TalkLine } from '@/lib/types';
import { borders, colors } from '@/theme';

/** .chat-log — the full transcript ("Show text"), newest at the bottom. */
export function ChatLog({ lines }: { lines: TalkLine[] }) {
  const scroll = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scroll}
      contentContainerStyle={styles.log}
      onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
      {lines.length === 0 ? (
        <Text variant="chatEmpty" style={styles.empty}>
          Your conversation will appear here as you talk.
        </Text>
      ) : (
        lines.map((line, i) => (
          <View key={i} style={[styles.row, line.who === 'you' && styles.rowYou]}>
            <View style={[styles.bubble, line.who === 'monty' ? styles.monty : styles.you]}>
              <Text variant="chatBubble">{line.text}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // .chat-log: gap 10, padding 4px 0 12px
  log: { gap: 10, paddingTop: 4, paddingBottom: 12 },
  empty: { marginTop: 20 },
  row: { flexDirection: 'row' },
  rowYou: { justifyContent: 'flex-end' },
  // .chat-bubble: max-width 82%, padding 10px 14px, radius 18, 2px border
  bubble: {
    maxWidth: '82%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: borders.default,
    borderColor: colors.ink,
  },
  monty: { backgroundColor: colors.leafTint, borderBottomLeftRadius: 6 },
  you: { backgroundColor: colors.surface, borderBottomRightRadius: 6 },
});

import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Icon, Pill, Text } from '@/components/ui';
import { conversationDate } from '@/lib/format';
import type { ConversationSummary } from '@/lib/types';
import { borders, colors } from '@/theme';

type RecentConversationsProps = {
  conversations: ConversationSummary[];
  onOpen: (conversation: ConversationSummary) => void;
};

/** .card.list — rows separated by 2px ink lines, chevron on the right. */
export function RecentConversations({ conversations, onOpen }: RecentConversationsProps) {
  return (
    <Card flush style={styles.list}>
      {conversations.map((c, i) => (
        <Pressable
          key={c.id}
          accessibilityRole="button"
          onPress={() => onOpen(c)}
          style={({ pressed }) => [styles.row, i > 0 && styles.divider, pressed && styles.pressed]}>
          <View style={styles.grow}>
            <Text variant="rowTitle">{conversationDate(c.startedAt)}</Text>
            <Text variant="small">{c.minutes} min</Text>
            {!c.hideChips && (c.grammarCount > 0 || c.naturalCount > 0) && (
              <View style={styles.chips}>
                {c.grammarCount > 0 && (
                  <Pill size="chipSm" background="coral" label={`${c.grammarCount} grammar`} />
                )}
                {c.naturalCount > 0 && (
                  <Pill size="chipSm" background="sea" label={`${c.naturalCount} more natural`} />
                )}
              </View>
            )}
          </View>
          <Icon name="chev" size={20} color="muted" />
        </Pressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { overflow: 'hidden' },
  // .row: padding 14px 16px, gap 12
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  divider: { borderTopWidth: borders.default, borderTopColor: colors.ink },
  pressed: { backgroundColor: colors.sunTint }, // .row:active
  grow: { flex: 1, minWidth: 0 },
  // .chips-sm: gap 6, margin-top 8
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
});

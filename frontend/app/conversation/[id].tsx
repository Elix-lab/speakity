import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CloseTopBar, Pill, SentenceCard, Text } from '@/components/ui';
import { getConversation } from '@/lib/api';
import { conversationDate } from '@/lib/format';
import type { ConversationDetail } from '@/lib/types';
import { colors, spacing } from '@/theme';

/**
 * The prototype's "convo" screen, opened from Home's recent conversations:
 * the title, when and how long, and every sentence its analysis found.
 */
export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // undefined while loading, null if the conversation doesn't exist
  const [convo, setConvo] = useState<ConversationDetail | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getConversation(id).then((c) => active && setConvo(c));
    return () => {
      active = false;
    };
  }, [id]);

  const goHome = () => router.back();

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <CloseTopBar onClose={goHome} closeLabel="Back to home" />

        {convo === null && <Text variant="sub">This conversation is no longer available.</Text>}

        {convo && (
          <>
            <Text variant="h1">{conversationDate(convo.startedAt)}</Text>
            <Text variant="sub">
              {convo.minutes} min · {convo.cards.length}{' '}
              {convo.cards.length === 1 ? 'insight' : 'insights'}
            </Text>

            {/* .chips (the prototype's hideDetailChips leaves a 16px gap instead) */}
            <View style={styles.chips}>
              {convo.grammarCount > 0 && (
                <Pill size="chip" background="coral" label={`${convo.grammarCount} grammar`} />
              )}
              {convo.naturalCount > 0 && (
                <Pill size="chip" background="sea" label={`${convo.naturalCount} more natural`} />
              )}
            </View>

            {convo.cards.map((card) => (
              <SentenceCard key={card.id} card={card} showWhy />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  // .scroll: padding 0 20px 20px
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.screenBottom },
  // .chips: gap 8, margin 12px 0 18px
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, marginBottom: 18 },
});

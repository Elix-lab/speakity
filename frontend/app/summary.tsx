import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WinHero } from '@/components/Talk/WinHero';
import { Button, CloseTopBar, Icon, Pill, SentenceCard, Text } from '@/components/ui';
import { getConversationRecap } from '@/lib/api';
import type { ConversationRecap } from '@/lib/types';
import { colors, spacing } from '@/theme';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * The prototype's "summary" screen, after "That's a wrap!": how long you
 * spoke, your wins, and the new sentences to work on. The new cards already
 * exist (the analysis created them); "Practice now" opens today's regular
 * review, so the daily caps still apply (CLAUDE.md rule 4).
 */
export default function SummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recap, setRecap] = useState<ConversationRecap | null>(null);

  useEffect(() => {
    let active = true;
    getConversationRecap(id).then((r) => active && setRecap(r));
    return () => {
      active = false;
    };
  }, [id]);

  if (!recap) return <SafeAreaView style={styles.screen} />;

  const { wins, newCards } = recap;
  const minutes = Math.max(1, Math.round(recap.durationSec / 60));
  const grammar = newCards.filter((c) => c.type === 'grammar').length;
  const natural = newCards.length - grammar;
  const lede = `${wins.length ? `${plural(wins.length, 'win')}, and ` : ''}${plural(newCards.length, 'thing')} to work on.`;

  const goHome = () => router.back();

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <CloseTopBar onClose={goHome} closeLabel="Back to home" />
        <Text variant="h1">You spoke for {minutes} min</Text>
        <Text variant="sub">{lede}</Text>

        {wins.length > 0 && <WinHero wins={wins} />}

        {newCards.length > 0 && (
          <>
            <Text variant="section" style={[styles.sec, { marginTop: wins.length ? 0 : 22 }]}>
              Things to work on
            </Text>
            {/* .chips */}
            <View style={styles.chips}>
              {grammar > 0 && <Pill size="chip" background="coral" label={`${grammar} grammar`} />}
              {natural > 0 && <Pill size="chip" background="sea" label={`${natural} more natural`} />}
            </View>
            {newCards.map((card) => (
              <SentenceCard key={card.id} card={card} showWhy />
            ))}
          </>
        )}
      </ScrollView>

      {/* .cta-bar */}
      <View style={styles.ctaBar}>
        <Button
          label="Practice now"
          variant="primary"
          icon={<Icon name="cards" size={22} />}
          // replace: closing the review goes back home, not here
          onPress={() => router.replace('/review')}
        />
        <Button label="Back home" onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  // .scroll: padding 0 20px 20px
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.screenBottom },
  sec: { marginBottom: 12 }, // .sec margin 24px 0 12px (top overridden inline, as in the prototype)
  // .chips: gap 8, margin 12px 0 18px (the .sec bottom margin already gives the top space)
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  ctaBar: { paddingTop: 12, paddingHorizontal: 20, paddingBottom: 18, gap: 10 }, // .cta-bar
});

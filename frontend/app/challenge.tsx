import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, CloseTopBar, Icon, SentenceCard, Text } from '@/components/ui';
import { getChallengeCards } from '@/lib/api';
import type { Flashcard } from '@/lib/types';
import { colors, spacing } from '@/theme';

/**
 * Pre-talk "Today's challenge": up to 2 Learning sentences (New ones only
 * when there's nothing in Learning, see getChallengeCards) to try to use
 * in the next conversation. Honor system — nothing checks whether you
 * used them (CLAUDE.md rule 2).
 */
export default function ChallengeScreen() {
  const [cards, setCards] = useState<Flashcard[] | null>(null);

  useEffect(() => {
    let active = true;
    getChallengeCards().then((c) => {
      if (!active) return;
      // nothing in Learning or New → no challenge, straight to the conversation
      if (c.length === 0) router.replace('/talk');
      else setCards(c);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!cards) return <SafeAreaView style={styles.screen} />;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <CloseTopBar onClose={() => router.back()} closeLabel="Back to home" />
        <Text variant="h1" style={styles.title}>
          Today&apos;s challenge
        </Text>
        <Text variant="sub" style={styles.sub}>
          Try to use {cards.length > 1 ? 'these' : 'this'} correctly and naturally during the conversation.
        </Text>
        {cards.map((card) => (
          <SentenceCard key={card.id} card={card} showIpa showWhy />
        ))}
      </ScrollView>

      {/* .cta-bar */}
      <View style={styles.ctaBar}>
        <Button
          label="Start talking"
          variant="primary"
          big
          icon={<Icon name="mic" size={24} />}
          // replace: leaving Talk goes back home, not to this screen
          onPress={() => router.replace('/talk')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  // .scroll: padding 0 20px 20px
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.screenBottom },
  title: { marginTop: 8, marginBottom: 6 }, // h1 margin 8px 0 6px
  sub: { marginBottom: 18 }, // inline margin-bottom 18px
  ctaBar: { paddingTop: 12, paddingHorizontal: 20, paddingBottom: 18 }, // .cta-bar
});

import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlipCard } from '@/components/Practice/FlipCard';
import { RateButtons } from '@/components/Practice/RateButtons';
import { ReviewDone } from '@/components/Practice/ReviewDone';
import { ReviewTopBar } from '@/components/Practice/ReviewTopBar';
import { Button } from '@/components/ui';
import { useReviewSession } from '@/hooks/useReviewSession';
import { colors, spacing } from '@/theme';

/** The prototype's "cards" screen: one flashcard at a time, then "done". */
export default function ReviewScreen() {
  const session = useReviewSession();
  const { card, secondLook } = session;

  // A card can come back for a second look, so the key includes the look.
  const cardKey = card ? `${card.id}:${secondLook ? 2 : 1}` : null;
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const revealed = cardKey !== null && revealedKey === cardKey;
  const reveal = () => setRevealedKey(cardKey);

  const close = () => router.back();

  if (session.phase === 'loading') return <SafeAreaView style={styles.screen} />;

  if (session.phase === 'done' || !card) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <ReviewDone
          total={session.total}
          mastered={session.mastered}
          learning={session.learning}
          onBack={close}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ReviewTopBar
          done={session.done}
          total={session.total}
          initial={session.initialCount}
          inProgress={session.inProgressCount}
          onClose={close}
        />
        <FlipCard key={cardKey} card={card} flipped={revealed} onFlip={reveal} onListen={session.listen} />
      </ScrollView>

      {/* .cta-bar — "Show answer" turns into the rating buttons */}
      <View style={styles.ctaBar}>
        {revealed ? (
          <RateButtons secondLook={secondLook} disabled={session.saving} onRate={session.rate} />
        ) : (
          <Button label="Show answer" variant="primary" onPress={reveal} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  // .scroll with inline padding-top 8px
  scroll: { paddingHorizontal: spacing.screenX, paddingTop: 8, paddingBottom: spacing.screenBottom },
  ctaBar: { paddingTop: 12, paddingHorizontal: 20, paddingBottom: 18 }, // .cta-bar
});

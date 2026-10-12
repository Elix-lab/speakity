import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThinkDots } from '@/components/Talk/ThinkDots';
import { Button, Mascot, StatSticker, Text } from '@/components/ui';
import { getConversationRecap } from '@/lib/api';
import type { ConversationRecap } from '@/lib/types';
import { colors } from '@/theme';

/**
 * The prototype's "recap" screen ("That's a wrap!"), shown right after a
 * conversation ends — feedback is immediate, never deferred (CLAUDE.md
 * rule 5). A conversation too short to analyze gets a light message
 * instead (rule 6).
 */
export default function RecapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recap, setRecap] = useState<ConversationRecap | null>(null);

  useEffect(() => {
    let active = true;
    getConversationRecap(id).then((r) => active && setRecap(r));
    return () => {
      active = false;
    };
  }, [id]);

  const goHome = () => router.back();

  // analysis still running
  if (!recap) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Mascot pose="think" width={200} />
          <Text variant="status" accessibilityLiveRegion="polite">
            Monty is going over your conversation
          </Text>
          <ThinkDots />
        </View>
      </SafeAreaView>
    );
  }

  if (!recap.analyzed) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Mascot pose="shrug" width={200} />
          <Text variant="h1" style={styles.title}>
            Nothing caught my eye
          </Text>
          <Text variant="sub" style={styles.text}>
            No slip-ups to practice yet. Keep the conversation going and I’ll find something.
          </Text>
        </View>
        <View style={styles.ctaBar}>
          <Button label="Back home" variant="primary" big onPress={goHome} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <Mascot pose="recap" width={220} />
        <Text variant="h1" style={styles.title}>
          That&apos;s a wrap!
        </Text>
        <Text variant="sub" style={styles.text}>
          Monty listened closely. Here&apos;s what he found.
        </Text>
        <View style={styles.stats}>
          <StatSticker n={recap.wins.length} label="you got right" />
          <StatSticker n={recap.newCards.length} label="to practice" />
        </View>
      </View>
      <View style={styles.ctaBar}>
        <Button
          label="See my sentences"
          variant="primary"
          big
          // replace: leaving the summary goes back home, not here
          onPress={() => router.replace({ pathname: '/summary', params: { id: recap.conversationId } })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  // .center: flex 1, centered column, padding 0 28px, gap 10
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 10 },
  title: { textAlign: 'center', marginTop: 8, marginBottom: 6 }, // h1 margin 8px 0 6px
  text: { textAlign: 'center' },
  // .stats: gap 10, margin-top 14, full width
  stats: { flexDirection: 'row', gap: 10, marginTop: 14, alignSelf: 'stretch' },
  ctaBar: { paddingTop: 12, paddingHorizontal: 20, paddingBottom: 18 }, // .cta-bar
});

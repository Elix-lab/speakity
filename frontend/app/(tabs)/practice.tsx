import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { DailyCapSheet } from '@/components/Practice/DailyCapSheet';
import { FocusAreas } from '@/components/Practice/FocusAreas';
import { PracticeHeader } from '@/components/Practice/PracticeHeader';
import { ProgressCard } from '@/components/Practice/ProgressCard';
import { WinLine } from '@/components/Practice/WinLine';
import { Button, Icon, SentenceCard, Text } from '@/components/ui';
import { useDailyReviewCap } from '@/hooks/useDailyReviewCap';
import { usePracticeData } from '@/hooks/usePracticeData';
import { colors, spacing } from '@/theme';

export default function PracticeScreen() {
  const { today, overview } = usePracticeData();
  // Already capped by the backend: ≤5 new cards/day and ≤ the daily review cap.
  const due = today?.dueToday ?? 0;
  const { cap, save: saveCap } = useDailyReviewCap();
  const [capSheetOpen, setCapSheetOpen] = useState(false);

  // The ink header runs under the status bar → light status bar content here.
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle('light');
      return () => StatusBar.setStyle('dark');
    }, []),
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <PracticeHeader streakDays={today?.streakDays ?? 0} />

        {overview && <ProgressCard stats={overview.stats} />}

        {today && (
          <View style={styles.cta}>
            {due > 0 ? (
              <Button
                label={`Review ${due} sentence${due === 1 ? '' : 's'}`}
                variant="primary"
                big
                onPress={() => router.push('/review')}
              />
            ) : (
              <>
                <Button label="All done for today" variant="primary" big disabled />
                <Text variant="small" style={styles.note}>
                  You&apos;ve reviewed today&apos;s sentences. Come back tomorrow!
                </Text>
              </>
            )}
            {/* shown on "All done" too: raising the cap brings the review back */}
            <Pressable
              onPress={() => setCapSheetOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={`Daily review: ${cap} sentences. Change`}
              style={styles.capRow}>
              <Text variant="small">
                Daily review: <Text variant="small" color="ink">{cap}</Text> sentences
              </Text>
              <Icon name="chev" size={14} color="muted" />
            </Pressable>
          </View>
        )}

        {overview && overview.focusAreas.length > 0 && (
          <>
            <Text variant="section" style={styles.sec}>
              What you&apos;re improving
            </Text>
            <FocusAreas areas={overview.focusAreas} />
          </>
        )}

        {overview && overview.corrected.length > 0 && (
          <>
            <Text variant="section" style={styles.sec}>
              Corrected in conversation
            </Text>
            <Text variant="sub" style={styles.lede}>
              Things you used to get wrong — and said the natural way while talking.
            </Text>
            {overview.corrected.map((card) => (
              <SentenceCard
                key={card.id}
                card={card}
                footer={<WinLine text="You said this correctly in your latest conversation" />}
              />
            ))}
          </>
        )}

        {overview && overview.masteredToday.length > 0 && (
          <>
            <Text variant="section" style={styles.sec}>
              Mastered
            </Text>
            <Text variant="sub" style={styles.lede}>
              Flashcards you&apos;ve studied enough to call done.
            </Text>
            {overview.masteredToday.map((card) => (
              <SentenceCard key={card.id} card={card} footer={<WinLine text="Moved from Learning to Mastered" />} />
            ))}
          </>
        )}

        {overview && (
          <Pressable
            onPress={() => router.push('/library')}
            accessibilityRole="link"
            style={styles.seeAll}>
            <Text variant="link">See all my sentences</Text>
            <Icon name="chev" size={16} />
          </Pressable>
        )}
      </ScrollView>

      {capSheetOpen && (
        <DailyCapSheet
          value={cap}
          onClose={() => setCapSheetOpen(false)}
          onSave={async (next) => {
            await saveCap(next);
            setCapSheetOpen(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  // .scroll.pr-scroll: padding 0 20px 20px (padding-top 0)
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.screenBottom },
  cta: { marginTop: 22 }, // .practice-cta
  note: { textAlign: 'center', marginTop: 12 }, // .limit-note
  // centered like .see-all, under the review button
  capRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 10, padding: 8 },
  sec: { marginTop: 24, marginBottom: 12 }, // .sec
  lede: { marginTop: 2, marginBottom: 14 }, // .pat-lede
  // .see-all: centered, gap 4, margin-top 22, padding 8
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 22,
    padding: 8,
  },
});

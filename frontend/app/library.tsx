import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateRange } from '@/components/Library/DateRange';
import { Pager } from '@/components/Library/Pager';
import { SentenceRow } from '@/components/Library/SentenceRow';
import { StatusFilter } from '@/components/Library/StatusFilter';
import { CloseTopBar, Text } from '@/components/ui';
import { useSentenceLibrary } from '@/hooks/useSentenceLibrary';
import { colors, spacing } from '@/theme';

/** "All my sentences" — every card, filterable by status and date, 6 per page. */
export default function LibraryScreen() {
  const { query, result, toggleStatus, setDates, setPage, listen } = useSentenceLibrary();
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set());
  const scroll = useRef<ScrollView>(null);

  const toggleOpen = (id: string) =>
    setOpenIds((ids) => {
      const next = new Set(ids);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const goToPage = (page: number) => {
    setPage(page);
    scroll.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView ref={scroll} contentContainerStyle={styles.scroll}>
        <CloseTopBar onClose={() => router.back()} closeLabel="Back to Practice" />

        <Text variant="h1" style={styles.title}>
          All my sentences
        </Text>
        <Text variant="sub" style={styles.count}>
          {result
            ? `${result.total} sentence${result.total === 1 ? '' : 's'} match your filters`
            : ' '}
        </Text>

        <StatusFilter selected={query.statuses} onToggle={toggleStatus} />
        <DateRange from={query.from} to={query.to} onChange={setDates} />

        <View style={styles.listTop}>
          {result?.items.map((card) => (
            <SentenceRow
              key={card.id}
              card={card}
              open={openIds.has(card.id)}
              onToggle={() => toggleOpen(card.id)}
              onListen={() => listen(card.better)}
            />
          ))}
          {result?.items.length === 0 && (
            <Text variant="hint" style={styles.hint}>
              No sentences match these filters yet.
            </Text>
          )}
          {result && result.pageCount > 1 && (
            <Pager page={result.page} pageCount={result.pageCount} onChange={goToPage} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  // .scroll: padding 0 20px 20px
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.screenBottom },
  title: { marginTop: 8, marginBottom: 6 }, // h1 margin 8px 0 6px
  count: { marginBottom: 14 },
  listTop: { marginTop: 16 }, // spacer div, height 16px
  hint: { marginTop: 20 }, // .album-hint
});

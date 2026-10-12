import { StyleSheet, View } from 'react-native';

import { Button, Mascot, StatSticker, Text } from '@/components/ui';

type ReviewDoneProps = {
  total: number;
  mastered: number;
  learning: number;
  onBack: () => void;
};

/** The prototype's "done" screen, shown when the session queue runs out. */
export function ReviewDone({ total, mastered, learning, onBack }: ReviewDoneProps) {
  return (
    <>
      <View style={styles.center}>
        <Mascot pose="recap" width={220} />
        <Text variant="h1" style={styles.title}>
          {total ? 'Nice work!' : 'All caught up'}
        </Text>
        <Text variant="sub" style={styles.text}>
          {total
            ? `${total} sentence${total === 1 ? '' : 's'} reviewed`
            : 'Nothing left to review today. Come back tomorrow!'}
        </Text>
        {total > 0 && (
          <View style={styles.stats}>
            <StatSticker n={mastered} label="mastered" />
            <StatSticker n={learning} label="still learning" />
          </View>
        )}
      </View>
      <View style={styles.ctaBar}>
        <Button label="Back to Practice" variant="primary" big onPress={onBack} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // .center: flex 1, centered column, padding 0 28px, gap 10
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 10 },
  title: { textAlign: 'center', marginTop: 8, marginBottom: 6 }, // h1 margin 8px 0 6px
  text: { textAlign: 'center' },
  // .stats: gap 10, margin-top 14, full width
  stats: { flexDirection: 'row', gap: 10, marginTop: 14, alignSelf: 'stretch' },
  ctaBar: { paddingTop: 12, paddingHorizontal: 20, paddingBottom: 18 }, // .cta-bar
});

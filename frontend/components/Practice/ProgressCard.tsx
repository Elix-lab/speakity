import { StyleSheet, View } from 'react-native';

import { CARD_STATUS, CARD_STATUS_ORDER, Card, Mascot, Pill, Text } from '@/components/ui';
import type { CardStats } from '@/lib/types';
import { borders, colors, radii } from '@/theme';

const STATUSES = CARD_STATUS_ORDER.map((key) => ({ key, ...CARD_STATUS[key] }));

type ProgressCardProps = {
  stats: CardStats;
};

/** .practice-card — pinned, tilted .5deg: mastered / total + the status bar. */
export function ProgressCard({ stats }: ProgressCardProps) {
  const total = stats.new + stats.learning + stats.mastered;
  const shown = STATUSES.filter((s) => stats[s.key] > 0);

  return (
    <Card pin tilt="right" style={styles.card}>
      <View style={styles.top}>
        <View>
          <Pill size="tag" label="Your progress" background="shellTint" />
          <Text variant="hero" style={styles.num}>
            {stats.mastered}
            <Text variant="heroOf"> / {total}</Text>
          </Text>
          <Text variant="hand">sentences mastered</Text>
        </View>
        <Mascot pose="holdingCard" width={92} />
      </View>

      <View
        style={styles.seg}
        accessibilityRole="image"
        accessibilityLabel={`${stats.new} new, ${stats.learning} learning, ${stats.mastered} mastered`}>
        {shown.map((s, i) => (
          <View
            key={s.key}
            style={[{ flex: stats[s.key], backgroundColor: colors[s.color] }, i > 0 && styles.segDivider]}
          />
        ))}
      </View>

      <View style={styles.legend}>
        {STATUSES.map((s) => (
          <View key={s.key} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors[s.color] }]} />
            <Text variant="legend">
              {s.label} <Text variant="legendCount">{stats[s.key]}</Text>
            </Text>
          </View>
        ))}
      </View>

      <Text variant="small" style={styles.cap}>
        Sentences move from New to Learning to Mastered as you review them.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  // .practice-card: padding 18px 16px 16px
  card: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 16 },
  // .pc-top: flex-start, space-between, gap 8
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  num: { marginTop: 10 }, // .pc-num
  // .seg: height 16, gap 3, radius 99, 2px border, white; margin-top 16
  seg: {
    flexDirection: 'row',
    gap: 3,
    height: 16,
    marginTop: 16,
    borderRadius: radii.full,
    overflow: 'hidden',
    borderWidth: borders.default,
    borderColor: colors.ink,
    backgroundColor: colors.surface,
  },
  segDivider: { borderLeftWidth: borders.chip, borderLeftColor: colors.ink }, // .seg i+i
  // .legend: wrap, gap 6px 16px, margin-top 12
  legend: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 6, columnGap: 16, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  // .dotc: 12px, 1.5px border, margin-right 6
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: borders.chip,
    borderColor: colors.ink,
  },
  cap: { marginTop: 12, lineHeight: 13 * 1.4 }, // .cap
});

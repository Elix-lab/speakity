import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { todayWeekIndex, WEEK_INITIALS } from '@/lib/format';
import type { WeekStats } from '@/lib/types';
import { borders, colors } from '@/theme';

/** "This week" card — totals + minutes-per-day bars. */
export function WeekStatsCard({ week }: { week: WeekStats }) {
  const totalMinutes = week.minutesPerDay.reduce((a, b) => a + b, 0);
  const max = Math.max(...week.minutesPerDay, 1);
  const todayIdx = todayWeekIndex();

  return (
    <Card>
      <View style={styles.two}>
        <View>
          <Text variant="bigNumber">{totalMinutes}</Text>
          <Text variant="small">minutes spoken</Text>
        </View>
        <View>
          <Text variant="bigNumber">{week.conversations}</Text>
          <Text variant="small">conversations</Text>
        </View>
      </View>

      <View
        style={styles.bars}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Minutes spoken per day this week">
        {week.minutesPerDay.map((m, i) => {
          // prototype: max(10, m/max*100)% when > 0, else a 6% dashed stub
          const height = m ? Math.max(10, Math.round((m / max) * 100)) : 6;
          return (
            <View key={i} style={styles.wbar}>
              <View style={[styles.bar, { height: `${height}%` }, !m && styles.zero]} />
              <Text variant="caption" style={i === todayIdx && styles.todayLabel}>
                {WEEK_INITIALS[i]}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  two: { flexDirection: 'row', gap: 28 },
  // .week-bars: height 96, gap 8, margin-top 16
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 96, marginTop: 16 },
  wbar: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  // .wbar i — flexShrink:1 so a 100% bar leaves room for the label, like CSS flex
  bar: {
    width: '100%',
    minHeight: 6,
    flexShrink: 1,
    borderWidth: borders.chip,
    borderColor: colors.ink,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: colors.leaf,
  },
  zero: { backgroundColor: colors.surface, borderStyle: 'dashed' },
  todayLabel: { color: colors.ink },
});

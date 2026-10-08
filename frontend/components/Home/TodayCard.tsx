import { StyleSheet, View } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import { todayWeekIndex, WEEK_INITIALS } from '@/lib/format';
import type { TodaySummary, WeekStats } from '@/lib/types';
import { borders, colors, fonts } from '@/theme';

import { TodayRing } from './TodayRing';

type TodayCardProps = {
  today: TodaySummary;
  week: WeekStats;
};

/** .card.today — ring + minutes, the week strip, and cards reviewed today. */
export function TodayCard({ today, week }: TodayCardProps) {
  const { minutesToday, minutesGoal, reviewedToday, dueToday } = today;
  const reached = minutesToday >= minutesGoal;
  const daysDone = week.daysDone.filter(Boolean).length;
  const todayIdx = todayWeekIndex();

  return (
    <Card>
      <View style={styles.top}>
        <TodayRing minutes={minutesToday} goal={minutesGoal} />
        <View style={styles.grow}>
          <Text variant="label">Today</Text>
          <Text variant="stat">
            {reached ? `${minutesToday} min today` : `${minutesToday} of ${minutesGoal} min`}
          </Text>
          <Text variant="small">
            {reached ? 'Goal reached. Nice work!' : `Talk ${minutesGoal} minutes to keep your streak`}
          </Text>
        </View>
      </View>

      <View style={[styles.weekHead, styles.mt16]}>
        <Text variant="meta">This week</Text>
        <Text variant="meta">{daysDone} of 7 days</Text>
      </View>
      <View style={styles.days}>
        {WEEK_INITIALS.map((initial, i) => {
          const done = week.daysDone[i];
          const isToday = !done && i === todayIdx;
          return (
            <View key={i} style={styles.day}>
              <View style={[styles.dayCircle, done && styles.dayDone, isToday && styles.dayToday]}>
                {done && <Icon name="check" size={18} color="white" />}
              </View>
              <Text variant="caption" style={isToday && styles.dayLabelToday}>
                {initial}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.weekHead, styles.reviewed]}>
        <Text variant="meta">Sentences reviewed today</Text>
        <Text variant="label">
          {reviewedToday} of {reviewedToday + dueToday}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  grow: { flex: 1, minWidth: 0 },
  mt16: { marginTop: 16 },
  weekHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  // .days: 7 columns, gap 4, margin-top 10
  days: { flexDirection: 'row', gap: 4, marginTop: 10 },
  day: { flex: 1, alignItems: 'center', gap: 6 },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: borders.default,
    borderColor: colors.ink,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDone: { backgroundColor: colors.ok },
  dayToday: { backgroundColor: colors.sun },
  dayLabelToday: { color: colors.ink, fontFamily: fonts.body[800] },
  // margin-top:16px; padding-top:14px; border-top:1px solid ink
  reviewed: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: borders.tag,
    borderTopColor: colors.ink,
  },
});

import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Icon, Text } from '@/components/ui';
import { colors } from '@/theme';

const SIZE = 84;
const R = 34;
const STROKE = 10;
const C = 2 * Math.PI * R;

type TodayRingProps = {
  minutes: number;
  goal: number;
};

/** .ring-wrap — 84px ring: minutes spoken today vs. the daily goal. */
export function TodayRing({ minutes, goal }: TodayRingProps) {
  const reached = minutes >= goal;
  const p = Math.min(1, minutes / goal);

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle cx={42} cy={42} r={R} fill="none" stroke={colors.ringTrack} strokeWidth={STROKE} />
        <Circle
          cx={42}
          cy={42}
          r={R}
          fill="none"
          stroke={reached ? colors.ok : colors.shell}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - p)}
          transform="rotate(-90 42 42)"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.num]}>
        {reached ? (
          <Icon name="check" size={30} />
        ) : (
          <>
            <Text variant="ring">{minutes}</Text>
            <Text variant="caption">min</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE },
  num: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

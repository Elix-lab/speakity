import { StyleSheet, View } from 'react-native';

import { PressableSticker, Text } from '@/components/ui';
import type { Rating } from '@/lib/types';
import { borders, colors, radii, type ColorToken } from '@/theme';

// .rate.again/.hard/.good/.easy + INTERVALS from the prototype
const RATES: { rating: Rating; label: string; interval: string; bg: ColorToken }[] = [
  { rating: 'again', label: 'Again', interval: '10m', bg: 'coralTint' },
  { rating: 'hard', label: 'Hard', interval: '1d', bg: 'sunTint' },
  { rating: 'good', label: 'Good', interval: '3d', bg: 'okTint' },
  { rating: 'easy', label: 'Easy', interval: '6d', bg: 'seaTint' },
];

type RateButtonsProps = {
  /** Second look at this card: it settles now, whatever the rating. */
  secondLook: boolean;
  disabled?: boolean;
  onRate: (rating: Rating) => void;
};

/** .rate-hint + .rates — the four rating buttons under a revealed card. */
export function RateButtons({ secondLook, disabled, onRate }: RateButtonsProps) {
  return (
    <View>
      <Text variant="small" style={styles.hint}>
        {secondLook ? 'Second look — this one settles now, however you rate it.' : 'How well did you remember it?'}
      </Text>
      <View style={styles.rates}>
        {RATES.map((r) => (
          <PressableSticker
            key={r.rating}
            pop="sm"
            radius={radii.rate}
            shadowWhenDisabled
            disabled={disabled}
            onPress={() => onRate(r.rating)}
            accessibilityRole="button"
            accessibilityLabel={`${r.label}, next review in ${r.interval}`}
            containerStyle={styles.cell}
            style={[styles.rate, { backgroundColor: colors[r.bg] }]}>
            <Text variant="rate">{r.label}</Text>
            <Text variant="rateInterval">{r.interval}</Text>
          </PressableSticker>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { textAlign: 'center', marginBottom: 10 }, // .rate-hint
  // .rates: 4 equal columns, gap 8
  rates: { flexDirection: 'row', gap: 8 },
  cell: { flex: 1 },
  // .rate: 2px border, radius 16, padding 10px 2px 8px, column, gap 2
  rate: {
    borderWidth: borders.default,
    borderColor: colors.ink,
    paddingTop: 10,
    paddingHorizontal: 2,
    paddingBottom: 8,
    alignItems: 'center',
    gap: 2,
  },
});

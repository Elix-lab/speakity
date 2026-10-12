import { StyleSheet, View } from 'react-native';

import { Icon, ProgressBar, RoundButton, Text } from '@/components/ui';
import { borders, colors, spacing, type ColorToken } from '@/theme';

type ReviewTopBarProps = {
  done: number;
  total: number;
  initial: number;
  inProgress: number;
  onClose: () => void;
};

/** .topbar on the cards screen (exit, session progress, n/total) + .pass-steps. */
export function ReviewTopBar({ done, total, initial, inProgress, onClose }: ReviewTopBarProps) {
  return (
    <>
      <View style={styles.topbar}>
        <RoundButton onPress={onClose} accessibilityLabel="Exit practice">
          <Icon name="x" size={20} />
        </RoundButton>
        <ProgressBar value={total ? done / total : 0} style={styles.progress} />
        <Text variant="count" style={styles.count}>
          {done}/{total}
        </Text>
      </View>
      <View style={styles.steps}>
        <Step color="new" label="Initial" n={initial} />
        <Step color="sun" label="In progress" n={inProgress} />
        <Step color="ok" label="Finished" n={done} />
      </View>
    </>
  );
}

function Step({ color, label, n }: { color: ColorToken; label: string; n: number }) {
  return (
    <View style={styles.step}>
      <View style={[styles.dot, { backgroundColor: colors[color] }]} />
      <Text variant="passStep">
        {label} <Text variant="passCount">{n}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // .topbar: padding 20px 20px 8px, gap 14 — the prototype nests it inside
  // .scroll, so it sits inside the 20px screen gutter too.
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: spacing.topbarMinHeight,
    paddingTop: spacing.topbarTop,
    paddingHorizontal: spacing.screenX,
    paddingBottom: spacing.topbarBottom,
  },
  progress: { flex: 1 },
  count: { minWidth: 34 }, // .count
  // .pass-steps: gap 16, wrap, margin 14px 0 4px, padding 0 2px
  steps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 14,
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  step: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  // .pass-dot: 10px, 1.5px border
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: borders.chip, borderColor: colors.ink },
});

import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Pill, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

/**
 * .pr-head — full-bleed ink header at the top of Practice. It runs up under
 * the status bar (light content while Practice is focused).
 */
export function PracticeHeader({ streakDays }: { streakDays: number }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.head, { paddingTop: insets.top + 10, paddingBottom: 18 }]}>
      <View style={styles.row}>
        <Text variant="practiceTitle">Practice</Text>
        <Pill label={String(streakDays)} background="sun" icon={<Icon name="flame" size={18} />} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // .pr-head: padding 16px 20px 18px, margin 0 -20px 22px (bleeds over .scroll's gutter)
  head: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.screenX,
    paddingBottom: 18,
    marginHorizontal: -spacing.screenX,
    marginBottom: 22,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  // .pr-head p: margin-top 3px, max-width 85%
  lede: { marginTop: 3, maxWidth: '85%' },
});

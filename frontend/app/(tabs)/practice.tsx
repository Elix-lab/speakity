import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

/** Placeholder until the Practice screen is built. */
export default function PracticeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text variant="h1">Practice</Text>
      <Text variant="sub">Coming next.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.screenX,
    paddingTop: spacing.topbarTop,
  },
});

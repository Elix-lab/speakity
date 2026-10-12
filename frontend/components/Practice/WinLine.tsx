import { StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { borders, colors } from '@/theme';

/** .win-line — green check badge + a short note, as a SentenceCard footer. */
export function WinLine({ text }: { text: string }) {
  return (
    <View style={styles.line}>
      <View style={styles.badge}>
        <Icon name="check" size={11} color="white" />
      </View>
      <Text variant="winLine" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // .win-line: gap 6, margin-top 10
  line: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  // .win-badge: 18px ok circle, 1.5px ink border
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.ok,
    borderWidth: borders.chip,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flexShrink: 1 },
});

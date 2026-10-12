import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { borders, colors } from '@/theme';

import { Text } from './Text';

/** .ipa — "Pronunciation (US)" box on a sea tint (sentence cards, flashcard back). */
export function IpaBox({ ipa, style }: { ipa: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.ipa, style]}>
      <Text variant="ipaLabel">Pronunciation (US)</Text>
      <Text variant="ipa" style={styles.text}>
        {ipa}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // .ipa: margin-top 12, radius 14, padding 9px 14px, 1px border
  ipa: {
    marginTop: 12,
    backgroundColor: colors.seaTint,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderWidth: borders.tag,
    borderColor: colors.ink,
  },
  text: { marginTop: 2 },
});

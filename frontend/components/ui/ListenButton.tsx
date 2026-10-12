import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { borders, colors, radii } from '@/theme';

import { Icon } from './Icon';
import { PressableSticker } from './Sticker';
import { Text } from './Text';

type ListenButtonProps = {
  onPress: () => void;
  /** What will be read aloud, for the accessibility label. */
  text: string;
  /** 22 on the flashcard, 20 in sentence cards. */
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
};

/** .audio — sea-tint pill with a speaker icon that reads the sentence aloud. */
export function ListenButton({ onPress, text, iconSize = 22, style }: ListenButtonProps) {
  return (
    <PressableSticker
      pop="sm"
      radius={radii.full}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Listen to ${text}`}
      containerStyle={[styles.wrap, style]}
      style={styles.face}>
      <Icon name="sound" size={iconSize} />
      <Text variant="pill">Listen</Text>
    </PressableSticker>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' }, // .audio: align-self flex-start
  // .audio: gap 10, sea tint, 2px border, padding 8px 16px, pill
  face: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.seaTint,
    borderWidth: borders.default,
    borderColor: colors.ink,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

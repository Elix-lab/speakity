import { StyleSheet, View } from 'react-native';

import { sizes, spacing } from '@/theme';

import { Icon } from './Icon';
import { Logo } from './Logo';
import { RoundButton } from './RoundButton';

type CloseTopBarProps = {
  onClose: () => void;
  closeLabel: string;
};

/**
 * .topbar with a close button, the logo centered (30px mark, 19px text)
 * and a 44px spacer on the right. Used on full-screen pages inside .scroll,
 * so it also sits inside the screen's 20px gutter.
 */
export function CloseTopBar({ onClose, closeLabel }: CloseTopBarProps) {
  return (
    <View style={styles.topbar}>
      <RoundButton onPress={onClose} accessibilityLabel={closeLabel}>
        <Icon name="x" size={20} />
      </RoundButton>
      <Logo size={30} fontSize={19} />
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  // .topbar: padding 20px 20px 8px, gap 12, min-height 68
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: spacing.topbarMinHeight,
    paddingTop: spacing.topbarTop,
    paddingHorizontal: spacing.screenX,
    paddingBottom: spacing.topbarBottom,
  },
  spacer: { width: sizes.round }, // <span style="width:44px">
});

import { StyleSheet, View } from 'react-native';

import { Icon, RoundButton, Sticker, Text } from '@/components/ui';
import { borders, colors, radii, spacing } from '@/theme';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

type TalkTopBarProps = {
  seconds: number;
  paused: boolean;
  onTogglePause: () => void;
};

/** .topbar on Talk — elapsed time pill + pause/resume round button. */
export function TalkTopBar({ seconds, paused, onTogglePause }: TalkTopBarProps) {
  return (
    <View style={styles.topbar}>
      {/* .timer: white pill, 2px border, padding 5px 14px, 2px pop */}
      <Sticker pop="sm" radius={radii.full} style={styles.timer}>
        <Text variant="timer">{fmt(seconds)}</Text>
      </Sticker>
      <RoundButton
        on={paused}
        onPress={onTogglePause}
        accessibilityLabel={paused ? 'Resume conversation' : 'Pause conversation'}
        accessibilityState={{ selected: paused }}>
        <Icon name={paused ? 'play' : 'pause'} size={22} />
      </RoundButton>
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
  timer: {
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
});

import { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Icon, PressableSticker } from '@/components/ui';
import { borders, colors, motion, sizes } from '@/theme';

type MicButtonProps = {
  onPress: () => void;
  /** Speaking / thinking / muted: stays visible but visually disabled. */
  disabled: boolean;
  /** .mic-btn-sm (40px, inside the chat mini-dock) */
  small?: boolean;
  /** "Start talking" when idle, "Done talking" while recording. */
  label: string;
  /** Recording: stays pressed in and turns green until tapped again. */
  active?: boolean;
};

/**
 * .mic-btn — tap to start your turn, tap again to end it. Coral circle with the big 6px pop shadow;
 * the press sinks 4px (not the full 6px, per the prototype's :active).
 * Disabled (Mia speaking/thinking, paused): #D7CDA6 fill, opacity .5, no
 * press — never hidden. Keeps its pop shadow (deliberate change from the
 * prototype, which dropped it).
 * Active (recording): held pressed in (sunk 4px, no shadow) and leaf green,
 * so it reads as "on"; the next tap ends the turn and it pops back out.
 */
export function MicButton({ onPress, disabled, small = false, label, active = false }: MicButtonProps) {
  const size = small ? sizes.micSmall : sizes.mic;
  const [opacity] = useState(() => new Animated.Value(disabled ? 0.5 : 1));

  useEffect(() => {
    // transition: opacity .2s
    Animated.timing(opacity, {
      toValue: disabled ? 0.5 : 1,
      duration: motion.micFade.duration,
      useNativeDriver: true,
    }).start();
  }, [disabled, opacity]);

  return (
    // Fade the button + its shadow as one image; otherwise Android fades each
    // layer separately and the ink shadow shows through the half-clear face.
    <Animated.View style={{ opacity }} needsOffscreenAlphaCompositing>
      <PressableSticker
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, selected: active }}
        pop="lg"
        pressTravel={4}
        held={active}
        shadowWhenDisabled
        radius={size / 2}
        style={[
          styles.face,
          { width: size, height: size },
          active && { backgroundColor: colors.leaf },
          disabled && { backgroundColor: colors.micDisabled },
        ]}>
        <Icon name="mic" size={small ? 20 : 26} color="white" />
      </PressableSticker>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  face: {
    backgroundColor: colors.coral,
    borderWidth: borders.default,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

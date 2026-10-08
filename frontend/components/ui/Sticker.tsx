import { useRef, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, motion, pop as popSizes, tilt as tilts, type PopSize, type Tilt } from '@/theme';

type BaseProps = {
  /** Offset of the solid ink shadow. `null` = no shadow. */
  pop?: PopSize | null;
  radius: number;
  tilt?: Tilt;
  /** Style of the visible face (background, border, padding…). */
  style?: StyleProp<ViewStyle>;
  /** Style of the outer wrapper (margins, flex, alignSelf…). */
  containerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * Solid offset "sticker" shadow. RN shadows always blur, so the shadow is
 * an ink View with the same radius drawn `pop` px down-right, behind the
 * face — the equivalent of `box-shadow: Npx Npx 0 var(--ink)`.
 */
export function Sticker({ pop = 'md', radius, tilt, style, containerStyle, children }: BaseProps) {
  const offset = pop ? popSizes[pop] : 0;
  return (
    <View style={[tilt && { transform: [{ rotate: `${tilts[tilt]}deg` }] }, containerStyle]}>
      {offset > 0 && <ShadowLayer offset={offset} radius={radius} />}
      <View style={[{ borderRadius: radius }, style]}>{children}</View>
    </View>
  );
}

type PressableStickerProps = BaseProps &
  Omit<PressableProps, 'style' | 'children'> & {
    /** How far the face sinks on press. Defaults to the shadow offset. */
    pressTravel?: number;
  };

/**
 * Pressable sticker: on press the face slides into its shadow and the
 * shadow disappears (`:active { transform: translate(pop,pop); box-shadow:none }`),
 * over the prototype's .08s transition.
 */
export function PressableSticker({
  pop = 'md',
  radius,
  tilt,
  style,
  containerStyle,
  children,
  pressTravel,
  disabled,
  onPressIn,
  onPressOut,
  ...pressableProps
}: PressableStickerProps) {
  const offset = pop && !disabled ? popSizes[pop] : 0;
  const travel = pressTravel ?? offset;
  const pressed = useRef(new Animated.Value(0)).current;

  const animateTo = (toValue: 0 | 1) =>
    Animated.timing(pressed, {
      toValue,
      duration: motion.press.duration,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      onPressIn={(e) => {
        animateTo(1);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animateTo(0);
        onPressOut?.(e);
      }}
      style={[tilt && { transform: [{ rotate: `${tilts[tilt]}deg` }] }, containerStyle]}>
      {offset > 0 && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: pressed.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) },
          ]}>
          <ShadowLayer offset={offset} radius={radius} />
        </Animated.View>
      )}
      <Animated.View
        style={[
          { borderRadius: radius },
          style,
          {
            transform: [
              { translateX: Animated.multiply(pressed, travel) },
              { translateY: Animated.multiply(pressed, travel) },
            ],
          },
        ]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function ShadowLayer({ offset, radius }: { offset: number; radius: number }) {
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          top: offset,
          left: offset,
          right: -offset,
          bottom: -offset,
          borderRadius: radius,
          backgroundColor: colors.ink,
        },
      ]}
    />
  );
}

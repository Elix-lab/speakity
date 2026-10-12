import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { CARD_TAG, IpaBox, ListenButton, Mascot, Pill, Sticker, Text } from '@/components/ui';
import type { Flashcard } from '@/lib/types';
import { borders, colors, fonts, motion, radii, sizes } from '@/theme';

const [x1, y1, x2, y2] = motion.flip.bezier;
const [e1, e2, e3, e4] = motion.enter.bezier;

type FlipCardProps = {
  card: Flashcard;
  flipped: boolean;
  /** Tap the card to reveal the answer (same as "Show answer"). */
  onFlip: () => void;
  onListen: () => void;
};

/**
 * .flip — the flashcard. Front: the sentence in the user's language, to
 * say in English. Back: the natural English sentence, IPA, why, and what
 * the user first said. Flips over .6s cubic-bezier(.3,1.15,.4,1),
 * perspective 1200px. Mount a new one per card (key) so it starts unflipped.
 */
export function FlipCard({ card, flipped, onFlip, onListen }: FlipCardProps) {
  const [t] = useState(() => new Animated.Value(0));
  const [enter] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(t, {
      toValue: flipped ? 1 : 0,
      duration: motion.flip.duration,
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver: true,
    }).start();
  }, [flipped, t]);

  // .enter — each new card slides up and fades in
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: motion.enter.duration,
      easing: Easing.bezier(e1, e2, e3, e4),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  // backface-visibility isn't reliable on Android, so each face also hides
  // itself once it has turned past 90°.
  const faceMotion = (from: 0 | -180) => ({
    opacity: t.interpolate({
      inputRange: [0, 0.5, 0.5001, 1],
      outputRange: from === 0 ? [1, 1, 0, 0] : [0, 0, 1, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      { perspective: 1200 },
      { rotateY: t.interpolate({ inputRange: [0, 1], outputRange: [`${from}deg`, `${from + 180}deg`] }) },
    ],
  });

  const tag = CARD_TAG[card.type];

  return (
    <Animated.View
      style={[
        styles.flip,
        {
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [motion.enter.fromY, 0] }) },
          ],
        },
      ]}>
      <Face motion={faceMotion(0)} active={!flipped}>
        <Pressable
          onPress={onFlip}
          accessibilityRole="button"
          accessibilityHint="Shows the answer"
          style={styles.fill}>
          <Text variant="faceLabel" style={styles.lab}>
            Say this in English
          </Text>
          <Text variant="quote" style={styles.quote}>
            “{card.es}”
          </Text>
          <View style={styles.askRow}>
            <Mascot pose="ask" width={96} />
            <Sticker pop="md" radius={radii.card} containerStyle={styles.bubbleWrap} style={styles.bubble}>
              <Text variant="bubbleSmall">Say it out loud, then tap Show answer</Text>
            </Sticker>
          </View>
        </Pressable>
      </Face>

      <Face motion={faceMotion(-180)} active={flipped}>
        <Pill size="tag" label={tag.label} background={tag.bg} />
        <Text variant="faceLabel" style={styles.labBack}>
          Natural English
        </Text>
        <Text variant="quote" style={[styles.quote, styles.quoteBack]}>
          “{card.better}”
        </Text>
        <IpaBox ipa={card.ipa} />
        <Text variant="why" style={styles.why}>
          {card.why}
        </Text>
        <Text variant="first" style={styles.first}>
          You first said: <Text style={styles.wrong}>{card.said}</Text>
        </Text>
        <ListenButton onPress={onListen} text={card.better} style={styles.audio} />
      </Face>
    </Animated.View>
  );
}

type FaceProps = {
  motion: Animated.WithAnimatedObject<ViewStyle>;
  /** The side facing the user — the other one ignores touches and screen readers. */
  active: boolean;
  children: ReactNode;
};

/** .face — white sticker, radius 24, padding 22, 4px pop shadow. */
function Face({ motion: faceMotion, active, children }: FaceProps) {
  return (
    <Animated.View
      pointerEvents={active ? 'auto' : 'none'}
      importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}
      accessibilityElementsHidden={!active}
      style={[StyleSheet.absoluteFill, faceMotion]}>
      <Sticker pop="md" radius={radii.hero} containerStyle={styles.fill} style={styles.face}>
        {children}
      </Sticker>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flip: { height: sizes.flip, marginTop: 10 }, // .flip
  fill: { flex: 1 },
  face: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
    padding: 22,
    overflow: 'hidden',
  },
  lab: { marginTop: 20 }, // .face .lab
  labBack: { marginTop: 14 }, // inline margin-top on the back
  quote: { marginTop: 6 }, // .quote
  quoteBack: { fontSize: 27, letterSpacing: -0.27 }, // .quote.right, inline font-size 27px
  // .ask-row: margin-top auto, flex-end, gap 4, margin-left/bottom -8
  askRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginLeft: -8,
    marginBottom: -8,
  },
  bubbleWrap: { flexShrink: 1, marginBottom: 20 },
  // .ask-row .bubble: sea tint, padding 12px 14px, 1px border (.bubble: radius 22, 4px pop)
  bubble: {
    backgroundColor: colors.seaTint,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: borders.tag,
    borderColor: colors.ink,
  },
  // inline style on the back's .why: margin-top 12, 14px / 700, muted, lh 1.4
  why: { marginTop: 12, fontFamily: fonts.body[700] },
  first: { marginTop: 8 }, // .first
  // .first s — coral tint behind the original sentence
  wrong: { backgroundColor: colors.coralTint, color: colors.ink },
  audio: { marginTop: 'auto' }, // .audio on the back face
});

import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import type { CardType, Flashcard } from '@/lib/types';
import { borders, colors, radii, type ColorToken } from '@/theme';

import { IpaBox } from './IpaBox';
import { ListenButton } from './ListenButton';
import { Pill } from './Pill';
import { Sticker } from './Sticker';
import { Text } from './Text';

/** Card type → .tag label and color. */
export const CARD_TAG: Record<CardType, { label: string; bg: ColorToken }> = {
  grammar: { label: 'Grammar', bg: 'coral' }, // .tag.t-grammar
  natural: { label: 'More natural', bg: 'sea' }, // .tag.t-natural
};

type SentenceCardProps = {
  card: Flashcard;
  showIpa?: boolean;
  showWhy?: boolean;
  /** The sentence in the user's language, under the correction. */
  showEs?: boolean;
  /** Shows a Listen button at the bottom. */
  onListen?: () => void;
  /** Extra content at the bottom (e.g. a WinLine on Practice). */
  footer?: ReactNode;
};

/**
 * .insight — the shared "sentence card" (Summary, Conversation detail,
 * Before-you-talk, the in-talk challenge, the library). Flashcards in
 * review keep their own flip-card design.
 */
export function SentenceCard({
  card,
  showIpa = false,
  showWhy = false,
  showEs = false,
  onListen,
  footer,
}: SentenceCardProps) {
  const tag = CARD_TAG[card.type];
  return (
    <Sticker pop="md" radius={radii.insight} style={styles.face} containerStyle={styles.container}>
      <Pill size="tag" label={tag.label} background={tag.bg} />
      <Text variant="said" style={styles.said}>
        You said:{' '}
        {/* .said s — coral tint behind the wrong sentence. RN nested Text can't
            take padding/radius, so only the tint is kept. */}
        <Text variant="said" color="ink" style={styles.wrong}>
          {card.said}
        </Text>
      </Text>
      <View style={styles.better}>
        <Text variant="better">{card.better}</Text>
      </View>
      {showEs && (
        <Text variant="small" style={styles.es}>
          {card.es}
        </Text>
      )}
      {showIpa && <IpaBox ipa={card.ipa} />}
      {showWhy && (
        <Text variant="why" style={styles.why}>
          {card.why}
        </Text>
      )}
      {footer}
      {onListen && <ListenButton onPress={onListen} text={card.better} iconSize={20} style={styles.listen} />}
    </Sticker>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 }, // .insight margin-bottom
  // .insight: padding 16px 16px 18px, radius 16
  face: {
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  said: { marginTop: 12 },
  wrong: { backgroundColor: colors.coralTint },
  // .better: padding 6px 12px, radius 12, 1.5px border, inline-block
  better: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.okTint,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: borders.chip,
    borderColor: colors.ink,
  },
  why: { marginTop: 10 },
  es: { marginTop: 8 },
  listen: { marginTop: 12 },
});

import { StyleSheet, View } from 'react-native';

import type { CardType, Flashcard } from '@/lib/types';
import { borders, colors, radii, type ColorToken } from '@/theme';

import { Pill } from './Pill';
import { Sticker } from './Sticker';
import { Text } from './Text';

const TAG: Record<CardType, { label: string; bg: ColorToken }> = {
  grammar: { label: 'Grammar', bg: 'coral' }, // .tag.t-grammar
  natural: { label: 'More natural', bg: 'sea' }, // .tag.t-natural
};

type SentenceCardProps = {
  card: Flashcard;
  showIpa?: boolean;
  showWhy?: boolean;
};

/**
 * .insight — the shared "sentence card" (Summary, Conversation detail,
 * Before-you-talk, the in-talk challenge, the library). Flashcards in
 * review keep their own flip-card design.
 */
export function SentenceCard({ card, showIpa = false, showWhy = false }: SentenceCardProps) {
  const tag = TAG[card.type];
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
      {showIpa && (
        <View style={styles.ipa}>
          <Text variant="ipaLabel">Pronunciation (US)</Text>
          <Text variant="ipa" style={styles.ipaText}>
            {card.ipa}
          </Text>
        </View>
      )}
      {showWhy && (
        <Text variant="why" style={styles.why}>
          {card.why}
        </Text>
      )}
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
  ipaText: { marginTop: 2 },
  why: { marginTop: 10 },
});

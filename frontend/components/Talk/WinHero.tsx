import { StyleSheet, View } from 'react-native';

import { Card, Icon, Pill, Text } from '@/components/ui';
import type { Flashcard } from '@/lib/types';
import { borders, colors, radii } from '@/theme';

/**
 * .win-hero — "You improved!": pending sentences the AI saw used correctly
 * in this conversation. Informational only (`.win`), it never moves a
 * card's status.
 */
export function WinHero({ wins }: { wins: Flashcard[] }) {
  return (
    <Card hero tilt="left" pin background="okTint" containerStyle={styles.container} style={styles.face}>
      <Pill size="tag" background="sun" label="You improved!" icon={<Icon name="spark" size={11} />} />
      <Text variant="hand" color="ink" style={styles.sub}>
        You used to get {wins.length > 1 ? 'these' : 'this'} wrong — not this time.
      </Text>
      {wins.map((c) => (
        <View key={c.id} style={styles.winCard}>
          <Text>
            You used to say:{' '}
            {/* .said s — coral tint behind the old sentence (no padding/radius on nested Text) */}
            <Text style={styles.wrong}>{c.said}</Text>
          </Text>
          <Text style={styles.better}>{c.better}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 18, marginBottom: 8 }, // .win-hero margin 18px 0 8px
  face: { padding: 16 }, // .win-hero padding 16
  sub: { marginTop: 4 }, // .win-hero-sub
  // .win-hero-card: margin-top 12, 1px ink border, radius 16, padding 12px 14px
  winCard: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderWidth: borders.tag,
    borderColor: colors.ink,
    borderRadius: radii.insight,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  wrong: { backgroundColor: colors.coralTint },
  better: { marginTop: 6 },
});

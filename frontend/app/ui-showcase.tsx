import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Pill, ProgressBar, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

/**
 * TEMPORARY: UI primitives showcase, to check against prototype.html
 * before the real Home screen is built. Replace with Home.
 */
export default function UiShowcase() {
  const [progress, setProgress] = useState(0.4);
  // sample values, only for the showcase
  const streakDays = 3;
  const minutesToday = 0;
  const minutesGoal = 5;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="h1">UI primitives</Text>
        <Text variant="sub">Sticker components from components/ui</Text>

        <Text variant="section" style={styles.sec}>
          Buttons
        </Text>
        <View style={styles.stack}>
          <Button label="Start talking" variant="primary" big />
          <Button label="Practice now" variant="primary" />
          <Button label="Nice! (sun)" variant="sun" />
          <Button label="End conversation" variant="coral" />
          <Button label="Show text" variant="ghost" />
          <Button label="Disabled" variant="primary" disabled />
        </View>

        <Text variant="section" style={styles.sec}>
          Pills, chips, tags
        </Text>
        <View style={styles.row}>
          <Pill label={`🔥 ${streakDays}`} background="sun" />
          <Pill label="Pill" />
        </View>
        <View style={[styles.row, styles.mt]}>
          <Pill size="chip" label="3 grammar" background="coral" />
          <Pill size="chip" label="2 more natural" background="sea" />
          <Pill size="chip" label="1 nice!" background="sun" />
          <Pill size="chip" label="tint" background="leafTint" />
        </View>
        <View style={[styles.row, styles.mt]}>
          <Pill size="tag" label="Grammar" background="coral" />
          <Pill size="tag" label="You improved!" background="sun" />
          <Pill size="tag" label="Plain" background="shellTint" />
        </View>

        <Text variant="section" style={styles.sec}>
          Progress
        </Text>
        <ProgressBar value={progress} />
        <View style={[styles.row, styles.mt]}>
          <Button label="−" style={styles.flex} onPress={() => setProgress((p) => Math.max(0, p - 0.2))} />
          <Button label="+" style={styles.flex} onPress={() => setProgress((p) => Math.min(1, p + 0.2))} />
        </View>

        <Text variant="section" style={styles.sec}>
          Cards
        </Text>
        <View style={styles.stack}>
          <Card>
            <Text variant="h2">Today</Text>
            <Text variant="stat">
              {minutesToday}/{minutesGoal} min
            </Text>
            <Text variant="small">Default .card — 22px radius, 4px pop</Text>
          </Card>
          <Card hero tilt="left" pin background="okTint">
            <Pill size="tag" label="You improved!" background="sun" />
            <Text variant="bubble" style={styles.mt}>
              You used it right this time!
            </Text>
          </Card>
          <Card tilt="right" pin>
            <Text variant="hero">
              12<Text variant="h2" color="muted"> / 15</Text>
            </Text>
            <Text variant="small">.practice-card — rotate .5deg + pin</Text>
          </Card>
          <Card>
            <Text variant="quote">I agree with you about that.</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: spacing.screenX,
    paddingTop: spacing.topbarTop,
    paddingBottom: 48,
  },
  sec: { marginTop: 24, marginBottom: 12 },
  stack: { gap: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mt: { marginTop: 10 },
  flex: { flex: 1 },
});

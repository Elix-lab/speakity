import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import type { FocusArea } from '@/lib/types';
import { borders, colors } from '@/theme';

const COLLAPSED = 4;

/** "What you're improving" — one row per mistake category, 4 shown until "See all". */
export function FocusAreas({ areas }: { areas: FocusArea[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? areas : areas.slice(0, COLLAPSED);

  return (
    <>
      <Card>
        {shown.map((a, i) => (
          <View key={a.category} style={i > 0 && styles.row}>
            {i > 0 && <DashedLine />}
            <Text variant="focusName" style={styles.name}>
              {a.category}
            </Text>
            <Text variant="small">
              {a.total} sentence{a.total > 1 ? 's' : ''} · {a.mastered} mastered · {a.learning + a.new} learning
            </Text>
            {/* .mini: mastered, learning, new */}
            <View style={styles.mini}>
              {a.mastered > 0 && <View style={{ flex: a.mastered, backgroundColor: colors.ok }} />}
              {a.learning > 0 && <View style={{ flex: a.learning, backgroundColor: colors.sea }} />}
              {a.new > 0 && <View style={{ flex: a.new, backgroundColor: colors.new }} />}
            </View>
          </View>
        ))}
      </Card>
      {areas.length > COLLAPSED && (
        <Pressable
          onPress={() => setExpanded((e) => !e)}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}>
          <Text variant="seeAllQuiet">{expanded ? 'Show less' : `See all ${areas.length}`}</Text>
          <Icon name="chev" size={14} color="muted" />
        </Pressable>
      )}
    </>
  );
}

/**
 * 1.5px dashed ink line. iOS only draws dashed borders on all four sides,
 * so this is a dashed box clipped down to its top edge.
 */
function DashedLine() {
  return (
    <View style={styles.dashClip}>
      <View style={styles.dashBox} />
    </View>
  );
}

const styles = StyleSheet.create({
  // .focus-row + .focus-row: margin-top 16, padding-top 16, 1.5px dashed top border
  row: { marginTop: 16, paddingTop: 16 },
  dashClip: { position: 'absolute', top: 0, left: 0, right: 0, height: borders.chip, overflow: 'hidden' },
  dashBox: {
    height: borders.chip * 4,
    borderWidth: borders.chip,
    borderColor: colors.ink,
    borderStyle: 'dashed',
  },
  name: { marginBottom: 2 }, // .focus-name
  // .mini: height 12, gap 3, 1.5px border, radius 8, white, margin-top 10
  mini: {
    flexDirection: 'row',
    gap: 3,
    height: 12,
    marginTop: 10,
    borderWidth: borders.chip,
    borderColor: colors.ink,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  // .see-all.quiet: centered, gap 4, padding 8, margin-top 10
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 8,
    marginTop: 10,
  },
  pressed: { opacity: 0.6 }, // .see-all.quiet:active
});

import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Sticker, Text } from '@/components/ui';
import { DAILY_REVIEW_CAP_OPTIONS, NEW_CARDS_PER_DAY, type DailyReviewCap } from '@/store/useSettingsStore';
import { borders, colors, radii } from '@/theme';

type DailyCapSheetProps = {
  value: DailyReviewCap;
  onClose: () => void;
  onSave: (cap: DailyReviewCap) => Promise<void>;
};

/**
 * Bottom sheet to pick the daily review cap (CLAUDE.md rule 4). The choice
 * only applies on Save; tapping outside closes it unchanged.
 */
export function DailyCapSheet({ value, onClose, onSave }: DailyCapSheetProps) {
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <SafeAreaView edges={['bottom']} style={styles.sheetWrap} pointerEvents="box-none">
        <Sticker pop="lg" radius={radii.card} style={styles.sheet}>
          <Text variant="label">Cards per day</Text>
          {/* .fchip-row, as in the library's status filter */}
          <View style={styles.row} accessibilityRole="radiogroup">
            {DAILY_REVIEW_CAP_OPTIONS.map((n) => {
              const active = n === draft;
              return (
                <Pressable
                  key={n}
                  onPress={() => setDraft(n)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
                  <Sticker pop={active ? 'sm' : null} radius={radii.full} style={[styles.chip, active && styles.active]}>
                    <Text variant="filterChip">{n}</Text>
                  </Sticker>
                </Pressable>
              );
            })}
          </View>
          <Text variant="small">
            You can change this whenever you want.
          </Text>
          <Button label="Save" variant="primary" disabled={saving} onPress={save} />
        </Sticker>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.scrim },
  sheetWrap: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 18 },
  // same material as the library's date sheet: surface, 2px border, radius 22, 6px pop, padding 16
  sheet: {
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
    padding: 16,
    gap: 12,
  },
  row: { flexDirection: 'row', gap: 8, paddingBottom: 2 },
  option: { flex: 1 },
  // .fchip: 2px border, pill, padding 6px 13px, surface (centered: the four share the row)
  chip: {
    borderWidth: borders.default,
    borderColor: colors.ink,
    paddingVertical: 6,
    paddingHorizontal: 13,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  active: { backgroundColor: colors.leaf }, // .fchip.active
  pressed: { transform: [{ scale: 0.95 }] }, // .fchip:active
});

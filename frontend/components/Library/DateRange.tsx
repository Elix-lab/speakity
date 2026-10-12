import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Icon, RoundButton, Sticker, Text } from '@/components/ui';
import { formatDay, fromLocalDay, toLocalDay } from '@/lib/format';
import { borders, colors, radii } from '@/theme';

type DateRangeProps = {
  from: string | null;
  to: string | null;
  onChange: (range: { from: string | null; to: string | null }) => void;
};

/**
 * .date-range — From / To days (max today), plus a clear button once
 * either is set. Dates are local calendar days (YYYY-MM-DD).
 */
export function DateRange({ from, to, onChange }: DateRangeProps) {
  const today = new Date();
  return (
    <View style={styles.row}>
      <DateField
        label="From"
        value={from}
        minimumDate={undefined}
        maximumDate={to ? fromLocalDay(to) : today}
        onChange={(day) => onChange({ from: day, to })}
      />
      <DateField
        label="To"
        value={to}
        minimumDate={from ? fromLocalDay(from) : undefined}
        maximumDate={today}
        onChange={(day) => onChange({ from, to: day })}
      />
      {(from || to) && (
        <RoundButton size={38} onPress={() => onChange({ from: null, to: null })} accessibilityLabel="Clear dates">
          <Icon name="x" size={16} />
        </RoundButton>
      )}
    </View>
  );
}

type DateFieldProps = {
  label: string;
  value: string | null;
  minimumDate: Date | undefined;
  maximumDate: Date;
  onChange: (day: string) => void;
};

function DateField({ label, value, minimumDate, maximumDate, onChange }: DateFieldProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const current = value ? fromLocalDay(value) : maximumDate;

  const open = () => {
    if (Platform.OS === 'android') {
      // Android: the system date dialog
      DateTimePickerAndroid.open({
        value: current,
        mode: 'date',
        minimumDate,
        maximumDate,
        onValueChange: (_, date) => onChange(toLocalDay(date)),
      });
    } else {
      setSheetOpen(true);
    }
  };

  return (
    <View style={styles.label}>
      <Text variant="caption">{label}</Text>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`${label} date: ${value ? formatDay(value) : 'any'}`}
        style={styles.input}>
        <Text variant="dateInput" color={value ? 'ink' : 'muted'} numberOfLines={1}>
          {value ? formatDay(value) : 'Any date'}
        </Text>
      </Pressable>
      {sheetOpen && (
        <IosDateSheet
          title={label}
          initial={current}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onClose={() => setSheetOpen(false)}
          onDone={(date) => {
            setSheetOpen(false);
            onChange(toLocalDay(date));
          }}
        />
      )}
    </View>
  );
}

type IosDateSheetProps = {
  title: string;
  initial: Date;
  minimumDate: Date | undefined;
  maximumDate: Date;
  onClose: () => void;
  onDone: (date: Date) => void;
};

/** iOS: inline calendar in a sticker sheet at the bottom, confirmed with Done. */
function IosDateSheet({ title, initial, minimumDate, maximumDate, onClose, onDone }: IosDateSheetProps) {
  const [draft, setDraft] = useState(initial);
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close date picker" />
      <SafeAreaView edges={['bottom']} style={styles.sheetWrap} pointerEvents="box-none">
        <Sticker pop="lg" radius={radii.card} style={styles.sheet}>
          <Text variant="label">{title}</Text>
          <DateTimePicker
            value={draft}
            mode="date"
            display="inline"
            themeVariant="light"
            accentColor={colors.ink}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onValueChange={(_, date) => setDraft(date)}
          />
          <Button label="Done" variant="primary" onPress={() => onDone(draft)} />
        </Sticker>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // .date-range: flex-end, gap 10, margin-top 12
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 12 },
  // .date-range label: flex 1, column, gap 4
  label: { flex: 1, gap: 4 },
  // .date-range input: surface, 2px border, radius 12, padding 7px 9px
  input: {
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 9,
  },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.scrim },
  sheetWrap: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 18 },
  // same material as .challenge-sheet: surface, 2px border, radius 22, 6px pop, padding 16
  sheet: {
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.ink,
    padding: 16,
    gap: 8,
  },
});

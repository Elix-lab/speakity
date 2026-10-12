import { StyleSheet, View } from 'react-native';

import { Icon, RoundButton, Text } from '@/components/ui';

type PagerProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

/** .pager — previous / "Page n of m" / next. */
export function Pager({ page, pageCount, onChange }: PagerProps) {
  return (
    <View style={styles.pager}>
      <RoundButton disabled={page <= 1} onPress={() => onChange(page - 1)} accessibilityLabel="Previous page">
        {/* chev points right; flip it for "previous" */}
        <View style={styles.flip}>
          <Icon name="chev" size={18} />
        </View>
      </RoundButton>
      <Text variant="small">
        Page {page} of {pageCount}
      </Text>
      <RoundButton disabled={page >= pageCount} onPress={() => onChange(page + 1)} accessibilityLabel="Next page">
        <Icon name="chev" size={18} />
      </RoundButton>
    </View>
  );
}

const styles = StyleSheet.create({
  // .pager: centered, gap 16, margin-top 18
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 18 },
  flip: { transform: [{ scaleX: -1 }] },
});

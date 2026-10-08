import { StyleSheet, View } from 'react-native';

import { Icon, Logo, Pill } from '@/components/ui';

/** .hello — logo on the left, streak pill on the right. */
export function HomeHeader({ streakDays }: { streakDays: number }) {
  return (
    <View style={styles.hello}>
      <Logo size={38} />
      <Pill
        label={String(streakDays)}
        background="sun"
        icon={<Icon name="flame" size={18} />}
        style={styles.right}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // .hello: padding 20px 20px 10px, gap 12 (inside .scroll's 20px gutter)
  hello: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  right: { marginLeft: 'auto', alignSelf: 'center' },
});

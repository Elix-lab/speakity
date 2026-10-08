import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { borders, colors, radii } from '@/theme';

import { Text } from './Text';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

/**
 * #tabs from the prototype: white bar, 2px ink top border, inactive tabs
 * in #A39B85, active in ink with the icon scaled 1.1. Screens provide
 * `title`, `tabBarIcon` and `tabBarBadge` (coral count dot) via options.
 */
export function TabBar({ state, descriptors, navigation, insets }: TabBarProps) {
  return (
    <View style={[styles.bar, { paddingBottom: 12 + insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused ? colors.ink : colors.tabInactive;
        const badge = options.tabBarBadge;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={options.title}
            onPress={onPress}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}>
            <View style={[styles.ico, focused && styles.icoActive]}>
              {options.tabBarIcon?.({ focused, color, size: 26 })}
              {badge != null && badge !== 0 && (
                <View style={styles.dot}>
                  <Text variant="caption" color="white">
                    {badge}
                  </Text>
                </View>
              )}
            </View>
            <Text variant="tab" style={{ color }}>
              {options.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // #tabs: padding 6px 14px 12px, surface, border-top 2px ink
  bar: {
    flexDirection: 'row',
    paddingTop: 6,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderTopWidth: borders.default,
    borderTopColor: colors.ink,
  },
  // .tab: height 56, radius 14, column, gap 2
  tab: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabPressed: { transform: [{ scale: 0.94 }] }, // .tab:active
  ico: { alignItems: 'center', justifyContent: 'center' },
  icoActive: { transform: [{ scale: 1.1 }] }, // .tab.active .ico
  // .tab .dot
  dot: {
    position: 'absolute',
    top: -6,
    right: -13,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: radii.full,
    backgroundColor: colors.coral,
    borderWidth: borders.chip,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

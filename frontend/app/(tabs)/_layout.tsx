import { Tabs } from 'expo-router';

import { Icon, TabBar } from '@/components/ui';
import { useTodayStore } from '@/store/useTodayStore';
import { colors } from '@/theme';

export default function TabsLayout() {
  const dueToday = useTodayStore((s) => s.today?.dueToday ?? 0);

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, size }) => <Icon name="home" size={size} color={focused ? 'ink' : 'tabInactive'} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarBadge: dueToday || undefined,
          tabBarIcon: ({ focused, size }) => <Icon name="cards" size={size} color={focused ? 'ink' : 'tabInactive'} />,
        }}
      />
    </Tabs>
  );
}

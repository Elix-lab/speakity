import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '@/components/Home/HomeHeader';
import { RecentConversations } from '@/components/Home/RecentConversations';
import { TodayCard } from '@/components/Home/TodayCard';
import { WeekStatsCard } from '@/components/Home/WeekStatsCard';
import { Button, Icon, Text } from '@/components/ui';
import { useHomeData } from '@/hooks/useHomeData';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const { today, week, conversations } = useHomeData();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <HomeHeader streakDays={today?.streakDays ?? 0} />

        {today && week && <TodayCard today={today} week={week} />}

        <View style={styles.midCta}>
          <Button
            label="Start talking"
            variant="primary"
            big
            icon={<Icon name="mic" size={26} />}
            disabled={today?.talkLimitReached}
            // TODO: navigate to the pre-talk screen once it exists
            onPress={() => console.log('[todo] start talking')}
          />
          {today?.talkLimitReached && (
            <Text variant="small" style={styles.limitNote}>
              You&apos;ve used today&apos;s talk time. Come back tomorrow!
            </Text>
          )}
        </View>

        <Text variant="section" style={styles.sec}>
          Recent conversations
        </Text>
        {conversations && (
          <RecentConversations
            conversations={conversations}
            // TODO: navigate to conversation detail once it exists
            onOpen={(c) => console.log('[todo] open conversation', c.id)}
          />
        )}

        <Text variant="section" style={styles.sec}>
          This week
        </Text>
        {week && <WeekStatsCard week={week} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  // .scroll: padding 0 20px 20px
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.screenBottom },
  midCta: { marginTop: 20 }, // .mid-cta
  limitNote: { textAlign: 'center', marginTop: 12 }, // .limit-note
  sec: { marginTop: 24, marginBottom: 12 }, // .sec
});

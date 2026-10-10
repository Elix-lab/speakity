import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChallengeToggle } from '@/components/Talk/ChallengeToggle';
import { ChatLog } from '@/components/Talk/ChatLog';
import { MicButton } from '@/components/Talk/MicButton';
import { TalkTopBar } from '@/components/Talk/TalkTopBar';
import { ThinkDots } from '@/components/Talk/ThinkDots';
import { Waves } from '@/components/Talk/Waves';
import { Button, Icon, Mascot, Text, type MiaPose } from '@/components/ui';
import { useConversation } from '@/hooks/useConversation';
import { getChallengeCards } from '@/lib/api';
import type { Flashcard, TalkMode } from '@/lib/types';
import { colors } from '@/theme';

const STATUS: Record<TalkMode, string> = {
  speaking: 'Mia is speaking',
  idle: 'Tap the mic to talk',
  listening: 'Your turn. Keep talking',
  thinking: 'Mia is thinking',
  muted: 'Paused',
};

/** Mia talks → talk pose · reply pending → think · otherwise (you talk, or nobody) → listen */
const POSE: Record<Exclude<TalkMode, 'muted'>, MiaPose> = {
  speaking: 'talk',
  idle: 'listen',
  listening: 'listen',
  thinking: 'think',
};

export default function TalkScreen() {
  const { mode, paused, lines, seconds, micDenied, onMicPress, togglePause, end } = useConversation();
  const [showText, setShowText] = useState(false);
  const [challenges, setChallenges] = useState<Flashcard[]>([]);
  // Pausing keeps whatever pose Mia had.
  const [pose, setPose] = useState<MiaPose>('think');

  useEffect(() => {
    if (mode !== 'muted') setPose(POSE[mode]);
  }, [mode]);

  useEffect(() => {
    getChallengeCards().then(setChallenges);
  }, []);

  // mic is usable only when nobody is talking (start) or while you talk (end)
  const micDisabled = mode !== 'idle' && mode !== 'listening';
  const micLabel = mode === 'listening' ? 'Done talking' : 'Start talking';
  const barsActive = mode === 'speaking' || mode === 'listening';

  const onEnd = async () => {
    await end();
    // TODO: go to the recap screen once it exists
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <TalkTopBar seconds={seconds} paused={paused} onTogglePause={togglePause} />

      {challenges.length > 0 && <ChallengeToggle cards={challenges} />}

      {showText ? (
        <>
          {/* .chat-stage + .mini-dock */}
          <View style={styles.chatStage}>
            <ChatLog lines={lines} />
          </View>
          <View style={styles.miniDock}>
            <Mascot pose={pose} width={56} />
            <MicButton small onPress={onMicPress} disabled={micDisabled} label={micLabel} active={mode === 'listening'} />
          </View>
        </>
      ) : (
        // .focus-stage: one big mascot, centered
        <View style={styles.focusStage}>
          <Mascot pose={pose} width={230} />
          {/* one fixed line: the mic-denied notice replaces the status
              instead of adding a row that would push everything down */}
          <Text
            variant="status"
            numberOfLines={1}
            adjustsFontSizeToFit
            accessibilityRole="text"
            accessibilityLiveRegion="polite">
            {micDenied && mode === 'idle' ? 'Allow mic access in Settings' : STATUS[mode]}
          </Text>
          {mode === 'thinking' ? <ThinkDots /> : <Waves active={barsActive} />}
          <View style={styles.micWrap}>
            <MicButton onPress={onMicPress} disabled={micDisabled} label={micLabel} active={mode === 'listening'} />
          </View>
        </View>
      )}

      {/* .talk-actions */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => setShowText((s) => !s)}
          accessibilityRole="button"
          style={styles.textToggle}>
          <Icon name={showText ? 'eyeOff' : 'eye'} size={20} />
          <Text variant="link">{showText ? 'Hide text' : 'Show text'}</Text>
        </Pressable>
        <Button label="End & see feedback" variant="coral" onPress={onEnd} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  // .focus-stage: flex 1, centered column, gap 14, padding 0 20px
  focusStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 20,
  },
  micWrap: { marginTop: 18 }, // .mic-btn margin-top
  // .chat-stage: flex 1, padding 0 20px
  chatStage: { flex: 1, paddingHorizontal: 20 },
  // .mini-dock: gap 16, padding 6px 0 2px
  miniDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 6,
    paddingBottom: 2,
  },
  // .talk-actions: margin-top auto, padding 12px 20px 18px
  actions: { marginTop: 'auto', paddingTop: 12, paddingHorizontal: 20, paddingBottom: 18 },
  // .text-toggle: gap 8, margin 0 auto 12px, padding 6px 10px
  textToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});

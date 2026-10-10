import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { useRef } from 'react';

import type { RecordedTurn } from '@/lib/types';

/**
 * Records one user turn with the device mic. The resulting file is what
 * gets uploaded for cloud transcription (never device STT).
 */
export function useTurnRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const startedAt = useRef<number | null>(null);

  /** Returns false if the user denied mic access. */
  const start = async (): Promise<boolean> => {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) return false;
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    startedAt.current = Date.now();
    return true;
  };

  const finish = async () => {
    await recorder.stop();
    // back to playback-only so Mia's voice plays at full speaker volume
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
  };

  const stop = async (): Promise<RecordedTurn> => {
    const durationMs = startedAt.current ? Date.now() - startedAt.current : 0;
    startedAt.current = null;
    await finish();
    return { uri: recorder.uri, durationMs };
  };

  /** Throw the current recording away (paused or left mid-turn). */
  const cancel = async () => {
    if (startedAt.current === null) return;
    startedAt.current = null;
    await finish();
  };

  return { start, stop, cancel };
}

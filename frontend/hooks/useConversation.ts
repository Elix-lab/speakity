import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';

import { endConversation, getMontyReply, startConversation, transcribeTurn } from '@/lib/api';
import type { TalkLine, TalkMode } from '@/lib/types';

import { useTurnRecorder } from './useTurnRecorder';

/** Prototype speak(): en-US, rate .92 */
const SPEECH_OPTIONS = { language: 'en-US', rate: 0.92 };

/**
 * Turn-based voice conversation (no realtime API — see CLAUDE.md).
 * Nothing advances on its own except Monty finishing a sentence:
 *
 *   speaking ──(TTS done)──▶ idle ──(mic tap)──▶ listening
 *       ▲                                            │ (mic tap)
 *       └──────(reply ready)────── thinking ◀────────┘
 *
 * Pause (`muted`) freezes everything; resuming replays what was cut off.
 */
export function useConversation() {
  const recorder = useTurnRecorder();
  const [mode, setModeState] = useState<TalkMode>('thinking');
  const [paused, setPaused] = useState(false);
  const [lines, setLines] = useState<TalkLine[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [micDenied, setMicDenied] = useState(false);
  /** The last turn couldn't be sent or answered; cleared on the next mic tap. */
  const [turnFailed, setTurnFailed] = useState(false);

  // Refs mirror state for async callbacks (TTS onDone, network replies).
  const modeRef = useRef<TalkMode>('thinking');
  const pausedRef = useRef(false);
  const linesRef = useRef<TalkLine[]>([]);
  const conversationId = useRef<string | null>(null);
  /** Mode that was interrupted by pause. */
  const resumeMode = useRef<TalkMode>('thinking');
  /** Monty's reply that arrived while paused, spoken on resume. */
  const pendingReply = useRef<string | null>(null);
  /** Bumped on every utterance so stale TTS callbacks are ignored. */
  const utterance = useRef(0);
  const alive = useRef(true);
  const micBusy = useRef(false);

  const setMode = (m: TalkMode) => {
    modeRef.current = m;
    setModeState(m);
  };

  const addLine = (line: TalkLine) => {
    linesRef.current = [...linesRef.current, line];
    setLines(linesRef.current);
  };

  const montySays = useCallback((text: string) => {
    setMode('speaking');
    const id = ++utterance.current;
    Speech.speak(text, {
      ...SPEECH_OPTIONS,
      // Monty done talking → nobody is talking; wait for the user's tap
      onDone: () => {
        if (alive.current && id === utterance.current && !pausedRef.current) setMode('idle');
      },
    });
  }, []);

  // Open the conversation: Monty greets first.
  useEffect(() => {
    alive.current = true;
    let active = true; // per-run flag, so a dev double-mount doesn't greet twice
    startConversation()
      .then(({ id, greeting }) => {
        if (!active) return;
        conversationId.current = id;
        addLine({ who: 'monty', text: greeting });
        if (pausedRef.current) pendingReply.current = greeting;
        else montySays(greeting);
      })
      .catch((err) => {
        console.warn('Could not start the conversation', err);
        if (active && !pausedRef.current) setMode('idle');
      });
    return () => {
      active = false;
      alive.current = false;
      utterance.current++;
      Speech.stop();
      recorder.cancel();
    };
    // recorder is stable for the screen's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [montySays]);

  // Conversation clock (stops while paused).
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  const endTurn = async () => {
    const id = conversationId.current;
    if (!id) return;
    const turn = await recorder.stop();
    setMode('thinking');
    try {
      const said = await transcribeTurn(id, turn);
      if (!alive.current) return;
      addLine({ who: 'you', text: said });
      const reply = await getMontyReply(id, linesRef.current);
      if (!alive.current) return;
      addLine({ who: 'monty', text: reply });
      if (pausedRef.current) pendingReply.current = reply;
      else montySays(reply);
    } catch (err) {
      // network or server failure: give the mic back so the turn can be said again
      console.warn('Turn failed', err);
      if (!alive.current) return;
      setTurnFailed(true);
      if (pausedRef.current) resumeMode.current = 'idle';
      else setMode('idle');
    }
  };

  /** Mic tap: idle → start your turn; listening → end it. Ignored otherwise. */
  const onMicPress = async () => {
    // ignore taps while the recorder is still starting/stopping
    if (pausedRef.current || micBusy.current) return;
    micBusy.current = true;
    try {
      if (modeRef.current === 'listening') return await endTurn();
      if (modeRef.current !== 'idle') return;
      setMicDenied(false);
      setTurnFailed(false);
      setMode('listening');
      const ok = await recorder.start();
      if (!ok) {
        setMicDenied(true);
        setMode('idle');
      }
    } finally {
      micBusy.current = false;
    }
  };

  const togglePause = () => {
    if (!pausedRef.current) {
      pausedRef.current = true;
      setPaused(true);
      resumeMode.current = modeRef.current;
      utterance.current++; // ignore the stopped utterance's callbacks
      Speech.stop();
      // a half-said turn is dropped; you start it again after resuming
      if (modeRef.current === 'listening') recorder.cancel();
      setMode('muted');
      return;
    }
    pausedRef.current = false;
    setPaused(false);
    const pending = pendingReply.current;
    pendingReply.current = null;
    if (pending) return montySays(pending);
    switch (resumeMode.current) {
      case 'speaking': {
        const last = [...linesRef.current].reverse().find((l) => l.who === 'monty');
        return last ? montySays(last.text) : setMode('idle');
      }
      case 'thinking':
        // still waiting on the network; endTurn speaks when it lands
        return setMode('thinking');
      default:
        return setMode('idle');
    }
  };

  /**
   * End the conversation and send it for analysis. Returns its id, or
   * null if it never got started (nothing to recap).
   */
  const end = async () => {
    alive.current = false;
    utterance.current++;
    Speech.stop();
    await recorder.cancel();
    const id = conversationId.current;
    if (id) await endConversation(id, linesRef.current, seconds);
    return id;
  };

  return { mode, paused, lines, seconds, micDenied, turnFailed, onMicPress, togglePause, end };
}

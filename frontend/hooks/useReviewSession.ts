import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';

import { getDueCards, rateCard } from '@/lib/api';
import { pickDailyQueue } from '@/lib/reviewQueue';
import type { Flashcard, Rating } from '@/lib/types';
import { NEW_CARDS_PER_DAY, useSettingsStore } from '@/store/useSettingsStore';
import { useTodayStore } from '@/store/useTodayStore';

const SPEECH_OPTIONS = { language: 'en-US', rate: 0.92 };

type Phase = 'loading' | 'reviewing' | 'done';

/**
 * One review session over today's due cards (the "cards" screen of the
 * prototype). The backend decides each card's new status — this hook only
 * re-queues a card when the backend says it isn't settled yet (first look,
 * not Easy), so it comes back once more at the end of the session.
 */
export function useReviewSession() {
  const dailyReviewCap = useSettingsStore((s) => s.dailyReviewCap);
  const loadToday = useTodayStore((s) => s.loadToday);

  const [phase, setPhase] = useState<Phase>('loading');
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [seen, setSeen] = useState<ReadonlySet<string>>(new Set());
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ done: 0, mastered: 0, learning: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getDueCards().then((due) => {
      if (!active) return;
      // The backend already applies both caps; this guard keeps the screen
      // honest if it ever sends more (CLAUDE.md rule 4: never show more).
      const capped = pickDailyQueue(due, { total: dailyReviewCap, new: NEW_CARDS_PER_DAY });
      setQueue(capped);
      setTotal(capped.length);
      setPhase(capped.length ? 'reviewing' : 'done');
    });
    return () => {
      active = false;
      Speech.stop();
      // refresh the Practice badge / Home "reviewed today" on the way out
      loadToday();
    };
  }, [dailyReviewCap, loadToday]);

  const card = queue[0] ?? null;

  const rate = async (rating: Rating) => {
    if (!card || saving) return;
    setSaving(true);
    Speech.stop();
    try {
      const result = await rateCard(card.id, rating);
      const rest = queue.slice(1);
      if (result.settled) {
        setStats((s) => ({
          done: s.done + 1,
          mastered: s.mastered + (result.status === 'mastered' ? 1 : 0),
          learning: s.learning + (result.status === 'mastered' ? 0 : 1),
        }));
      } else {
        setSeen((s) => new Set(s).add(card.id));
        rest.push(card);
      }
      setQueue(rest);
      if (!rest.length) setPhase('done');
    } finally {
      setSaving(false);
    }
  };

  const listen = () => {
    if (!card) return;
    Speech.stop();
    Speech.speak(card.better, SPEECH_OPTIONS);
  };

  return {
    phase,
    card,
    /** Second look at this card — it settles now, whatever the rating. */
    secondLook: card ? seen.has(card.id) : false,
    total,
    ...stats,
    /** .pass-steps: cards not seen yet / seen once and waiting for their second look. */
    initialCount: queue.filter((c) => !seen.has(c.id)).length,
    inProgressCount: queue.filter((c) => seen.has(c.id)).length,
    saving,
    rate,
    listen,
  };
}

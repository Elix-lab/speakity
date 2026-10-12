import type { Flashcard } from './types';

type DailySlots = {
  /** Cards that can still be shown today (daily review cap minus already reviewed). */
  total: number;
  /** New cards that can still be activated today (5/day minus already activated). */
  new: number;
};

const endOfToday = (now: Date) => {
  const d = new Date(now);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Picks today's review queue under the two caps from CLAUDE.md rule 4:
 * - due cards (already in Learning) first, oldest due first;
 * - then new cards from the backlog, oldest first, up to the new-card slots;
 * - never more than the total slots, however big the real queue is.
 * Mastered cards are not reviewed.
 */
export function pickDailyQueue(cards: Flashcard[], slots: DailySlots, now = new Date()): Flashcard[] {
  const total = Math.max(0, slots.total);
  const cutoff = endOfToday(now).getTime();
  const byDue = (a: Flashcard, b: Flashcard) => Date.parse(a.dueAt) - Date.parse(b.dueAt);

  const due = cards
    .filter((c) => c.status === 'learning' && Date.parse(c.dueAt) <= cutoff)
    .sort(byDue)
    .slice(0, total);

  const newSlots = Math.max(0, Math.min(slots.new, total - due.length));
  const fresh = cards
    .filter((c) => c.status === 'new')
    .sort(byDue)
    .slice(0, newSlots);

  return [...due, ...fresh];
}

import { NEW_CARDS_PER_DAY } from '../config/constants.js';
import { cards, reviews } from '../db/mockStore.js';
import type { Card } from '../models/card.js';
import type { User } from '../models/auth.js';
import { endOfDay } from '../utils/dates.js';
import { userDay } from './shared.js';

type DailySlots = {
  /** Cards that can still be shown today (daily review cap minus already reviewed). */
  total: number;
  /** New cards that can still be activated today (5/day minus already activated). */
  new: number;
};

/**
 * Picks today's review queue under the two caps from CLAUDE.md rule 4:
 * - due cards (already in Learning) first, oldest due first;
 * - then new cards from the backlog, oldest first, up to the new-card slots;
 * - never more than the total slots, however big the real queue is.
 * Mastered cards are not reviewed. (Same as frontend/lib/reviewQueue.ts.)
 */
export function pickDailyQueue(userCards: Card[], slots: DailySlots, now = new Date()): Card[] {
  const total = Math.max(0, slots.total);
  const cutoff = endOfDay(now).getTime();
  const byDue = (a: Card, b: Card) => a.dueAt.getTime() - b.dueAt.getTime();

  const due = userCards
    .filter((c) => c.status === 'learning' && c.dueAt.getTime() <= cutoff)
    .sort(byDue)
    .slice(0, total);

  const newSlots = Math.max(0, Math.min(slots.new, total - due.length));
  const fresh = userCards
    .filter((c) => c.status === 'new')
    .sort(byDue)
    .slice(0, newSlots);

  return [...due, ...fresh];
}

/** The user's ratings from today. */
export function todaysReviews(user: User) {
  const day = userDay(user);
  return reviews.filter((r) => r.userId === user.id && r.day === day);
}

/**
 * What's left of today's review. Cards already settled today count against
 * the daily cap and new cards already rated against the 5/day cap, so this
 * shrinks during the day. A cap change applies at once, also the same day.
 */
export function dailyQueue(user: User): Card[] {
  const today = todaysReviews(user);
  return pickDailyQueue(
    cards.filter((c) => c.userId === user.id),
    {
      total: user.dailyReviewCap - today.filter((r) => r.settled).length,
      new: NEW_CARDS_PER_DAY - today.filter((r) => r.statusBefore === 'new').length,
    },
  );
}

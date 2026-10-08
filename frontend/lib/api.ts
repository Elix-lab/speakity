import { mockCards, mockConversations, mockToday, mockWeek } from './mockData';
import type { ConversationSummary, Flashcard, Rating, TodaySummary, WeekStats } from './types';

/**
 * Typed calls to the backend. Mocked for now — keep these names and
 * signatures and swap the bodies for real fetch calls later.
 */

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/** GET /me/today */
export async function getTodaySummary(): Promise<TodaySummary> {
  await delay();
  return mockToday;
}

/** GET /me/week — current week, Monday first. */
export async function getWeekStats(): Promise<WeekStats> {
  await delay();
  return mockWeek;
}

/** GET /conversations?limit= — most recent first. */
export async function getRecentConversations(limit = 3): Promise<ConversationSummary[]> {
  await delay();
  return mockConversations.slice(0, limit);
}

/** GET /cards/due — the backend applies the 5 new/day and daily review caps. */
export async function getDueCards(): Promise<Flashcard[]> {
  await delay();
  return mockCards.filter((card) => card.status !== 'mastered');
}

/** POST /cards/:id/review — the only path that changes a card's status. */
export async function rateCard(cardId: string, rating: Rating): Promise<void> {
  await delay();
  console.log('[mock] rateCard', cardId, rating);
}

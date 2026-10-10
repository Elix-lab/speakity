import {
  mockCards,
  mockConversations,
  mockMiaLines,
  mockToday,
  mockUserLines,
  mockWeek,
} from './mockData';
import type {
  ConversationSummary,
  Flashcard,
  Rating,
  RecordedTurn,
  TalkLine,
  TodaySummary,
  WeekStats,
} from './types';

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

/** Today's challenge: up to 2 sentences currently in "learning". */
export async function getChallengeCards(): Promise<Flashcard[]> {
  await delay();
  return mockCards.filter((card) => card.status === 'learning').slice(0, 2);
}

// ---- Conversation pipeline (turn-based, see CLAUDE.md) ----

/** POST /conversations — opens a conversation, returns Mia's greeting. */
export async function startConversation(): Promise<{ id: string; greeting: string }> {
  await delay();
  return { id: `mock-${Date.now()}`, greeting: mockMiaLines[0] };
}

/**
 * POST /conversations/:id/transcribe — cloud STT of one recorded turn.
 * Never device STT: it autocorrects, and we need the mistakes as said.
 */
export async function transcribeTurn(conversationId: string, turn: RecordedTurn): Promise<string> {
  await delay(700);
  const yourTurns = turnCounter.get(conversationId) ?? 0;
  turnCounter.set(conversationId, yourTurns + 1);
  return mockUserLines[yourTurns % mockUserLines.length];
}

/** POST /conversations/:id/reply — cheap text model generates Mia's next line. */
export async function getMiaReply(conversationId: string, history: TalkLine[]): Promise<string> {
  await delay(800);
  const miaTurns = history.filter((l) => l.who === 'mia').length;
  return mockMiaLines[miaTurns % mockMiaLines.length];
}

/** POST /conversations/:id/end — triggers the end-to-end analysis. */
export async function endConversation(
  conversationId: string,
  transcript: TalkLine[],
  durationSec: number,
): Promise<void> {
  await delay();
  console.log('[mock] endConversation', conversationId, transcript.length, 'lines', durationSec, 's');
}

// mock-only: which scripted user line comes next, per conversation
const turnCounter = new Map<string, number>();

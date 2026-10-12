import {
  mockCards,
  mockConversations,
  mockMontyLines,
  mockToday,
  mockUserLines,
  mockWeek,
} from './mockData';
import { toLocalDay } from './format';
import { pickDailyQueue } from './reviewQueue';
import type {
  CardStats,
  ConversationRecap,
  ConversationSummary,
  FocusArea,
  Flashcard,
  PracticeOverview,
  Rating,
  RecordedTurn,
  ReviewResult,
  SentencePage,
  SentenceQuery,
  TalkLine,
  TodaySummary,
  WeekStats,
} from './types';
import { NEW_CARDS_PER_DAY, useSettingsStore } from '@/store/useSettingsStore';

/**
 * Typed calls to the backend. Mocked for now — keep these names and
 * signatures and swap the bodies for real fetch calls later.
 */

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/** GET /me/today */
export async function getTodaySummary(): Promise<TodaySummary> {
  await delay();
  return { ...mockToday, reviewedToday: reviewLog.reviewed, dueToday: dailyQueue().length };
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

/**
 * GET /cards/due — what's left of today's review: due cards first, then
 * new ones, under the 5 new/day cap and the user's daily review cap.
 * Cards already reviewed today count against the cap, so this shrinks
 * during the day.
 */
export async function getDueCards(): Promise<Flashcard[]> {
  await delay();
  return dailyQueue();
}

/** GET /practice — progress, focus areas and recent wins for the Practice tab. */
export async function getPracticeOverview(): Promise<PracticeOverview> {
  await delay();
  const stats: CardStats = { new: 0, learning: 0, mastered: 0 };
  const byCategory = new Map<string, FocusArea>();
  cards.forEach((c) => {
    stats[c.status]++;
    const area = byCategory.get(c.category) ?? { category: c.category, total: 0, new: 0, learning: 0, mastered: 0 };
    area.total++;
    area[c.status]++;
    byCategory.set(c.category, area);
  });
  // most still-to-learn first, then the biggest category
  const focusAreas = [...byCategory.values()].sort(
    (a, b) => b.total - b.mastered - (a.total - a.mastered) || b.total - a.total,
  );
  const masteredToday = cards.filter((c) => reviewLog.masteredToday.has(c.id));
  return {
    stats,
    focusAreas,
    corrected: cards.filter((c) => c.win && !reviewLog.masteredToday.has(c.id)).slice(0, 3),
    masteredToday: masteredToday.slice(0, 3),
  };
}

/**
 * POST /cards/:id/review — the only path that changes a card's status
 * (the AI never does). Two looks per session, as in the prototype:
 * - first look + Easy → Mastered, done for today;
 * - first look + anything else → Learning, comes back once more this session;
 * - second look → stays Learning, done for today, whatever the rating.
 */
export async function rateCard(cardId: string, rating: Rating): Promise<ReviewResult> {
  await delay();
  const card = cards.find((c) => c.id === cardId);
  if (!card) throw new Error(`Unknown card ${cardId}`);

  const looks = (reviewLog.looks.get(cardId) ?? 0) + 1;
  reviewLog.looks.set(cardId, looks);
  if (card.status === 'new') reviewLog.newActivated++;

  const settled = looks > 1 || rating === 'easy';
  card.status = looks === 1 && rating === 'easy' ? 'mastered' : 'learning';
  if (settled) {
    reviewLog.reviewed++;
    if (card.status === 'mastered') reviewLog.masteredToday.add(cardId);
    card.dueAt = inDays(INTERVAL_DAYS[rating]);
  }
  return { status: card.status, settled };
}

const SENTENCES_PAGE_SIZE = 6;

/**
 * GET /cards?status=&from=&to=&page= — "All my sentences": filtered by
 * status and by the day the sentence was said, newest first, 6 per page.
 */
export async function getSentences(query: SentenceQuery): Promise<SentencePage> {
  await delay();
  const matches = cards
    .filter((c) => {
      const day = toLocalDay(new Date(c.createdAt));
      return (
        query.statuses.includes(c.status) &&
        (!query.from || day >= query.from) &&
        (!query.to || day <= query.to)
      );
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const pageCount = Math.max(1, Math.ceil(matches.length / SENTENCES_PAGE_SIZE));
  const page = Math.min(Math.max(1, query.page), pageCount);
  return {
    items: matches.slice((page - 1) * SENTENCES_PAGE_SIZE, page * SENTENCES_PAGE_SIZE),
    total: matches.length,
    page,
    pageCount,
  };
}

/** Today's challenge: up to 2 sentences currently in "learning". */
export async function getChallengeCards(): Promise<Flashcard[]> {
  await delay();
  return cards.filter((card) => card.status === 'learning').slice(0, 2);
}

// ---- Conversation pipeline (turn-based, see CLAUDE.md) ----

/** POST /conversations — opens a conversation, returns Monty's greeting. */
export async function startConversation(): Promise<{ id: string; greeting: string }> {
  await delay();
  return { id: `mock-${Date.now()}`, greeting: mockMontyLines[0] };
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

/** POST /conversations/:id/reply — cheap text model generates Monty's next line. */
export async function getMontyReply(conversationId: string, history: TalkLine[]): Promise<string> {
  await delay(800);
  const montyTurns = history.filter((l) => l.who === 'monty').length;
  return mockMontyLines[montyTurns % mockMontyLines.length];
}

/** POST /conversations/:id/end — triggers the end-to-end analysis. */
export async function endConversation(
  conversationId: string,
  transcript: TalkLine[],
  durationSec: number,
): Promise<void> {
  await delay();
  endedConversations.set(conversationId, { transcript, durationSec });
}

/**
 * GET /conversations/:id/recap — waits for the analysis started by
 * endConversation and returns what Monty found.
 */
export async function getConversationRecap(conversationId: string): Promise<ConversationRecap> {
  await delay(900);
  const ended = endedConversations.get(conversationId);
  const durationSec = ended?.durationSec ?? 0;
  // mock rule: nothing you said → nothing to analyze
  const analyzed = !!ended?.transcript.some((l) => l.who === 'you');
  if (!analyzed) return { conversationId, durationSec, analyzed, wins: [], newCards: [] };
  return {
    conversationId,
    durationSec,
    analyzed,
    // prototype recap: wins = today's challenge cards, new = its NEW list
    wins: cards.filter((c) => c.status === 'learning').slice(0, 2),
    newCards: cards.filter((c) => ['n1', 'n2', 'n3', 'n4'].includes(c.id)),
  };
}

// mock-only: which scripted user line comes next, per conversation
const turnCounter = new Map<string, number>();

// mock-only: what endConversation received, for getConversationRecap
const endedConversations = new Map<string, { transcript: TalkLine[]; durationSec: number }>();

// ---- mock-only review state (the backend keeps this per user, per day) ----

const cards = mockCards.map((c) => ({ ...c }));

const reviewLog = {
  /** Cards settled today — they count against the daily review cap. */
  reviewed: 0,
  /** New cards rated for the first time today — they count against the 5/day cap. */
  newActivated: 0,
  /** Ratings per card today, to tell a first look from the second. */
  looks: new Map<string, number>(),
  /** Cards rated into Mastered today (Practice's "Mastered" section). */
  masteredToday: new Set<string>(),
};

// Settled cards come back no sooner than tomorrow ("Again" = 10m is the
// in-session second look, already handled by `settled: false`).
const INTERVAL_DAYS: Record<Rating, number> = { again: 1, hard: 1, good: 3, easy: 6 };

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

/** The real backend knows the user's settings; the mock reads them from the store. */
function dailyQueue() {
  const { dailyReviewCap } = useSettingsStore.getState();
  return pickDailyQueue(cards, {
    total: dailyReviewCap - reviewLog.reviewed,
    new: NEW_CARDS_PER_DAY - reviewLog.newActivated,
  });
}

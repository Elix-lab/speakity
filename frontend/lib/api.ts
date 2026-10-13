import Constants from 'expo-constants';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';

import type {
  ConversationDetail,
  ConversationRecap,
  ConversationSummary,
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
import type { DailyReviewCap } from '@/store/useSettingsStore';

/** Typed calls to the backend (backend/). */

const BACKEND_PORT = 3000;

/**
 * EXPO_PUBLIC_API_URL wins. Without it, in development the backend is
 * assumed on the same machine as Metro: its LAN host works from a phone
 * on the same network, where "localhost" would be the phone itself.
 */
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  `http://${Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost'}:${BACKEND_PORT}`;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: init.body && !isForm ? { 'Content-Type': 'application/json', ...init.headers } : init.headers,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error ?? `${init.method ?? 'GET'} ${path} failed (${res.status})`);
  }
  // 202/204: no body
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });

/** GET /me/today */
export async function getTodaySummary(): Promise<TodaySummary> {
  return request('/me/today');
}

/** GET /me/week — current week, Monday first. */
export async function getWeekStats(): Promise<WeekStats> {
  return request('/me/week');
}

/** GET /conversations?limit= — one entry per day, most recent first. */
export async function getRecentConversations(limit = 3): Promise<ConversationSummary[]> {
  return request(`/conversations?limit=${limit}`);
}

/** GET /conversations/:id — a past day with the sentences it produced. */
export async function getConversation(conversationId: string): Promise<ConversationDetail | null> {
  try {
    return await request(`/conversations/${encodeURIComponent(conversationId)}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

/**
 * GET /cards/due — what's left of today's review: due cards first, then
 * new ones, under the 5 new/day cap and the user's daily review cap.
 * Cards already reviewed today count against the cap, so this shrinks
 * during the day.
 */
export async function getDueCards(): Promise<Flashcard[]> {
  return request('/cards/due');
}

/** GET /me/settings — read once at startup. */
export async function getSettings(): Promise<{ dailyReviewCap: DailyReviewCap }> {
  return request('/me/settings');
}

/**
 * PATCH /me/settings — the backend applies the daily review cap to
 * /cards/due and /me/today, from the same day on (CLAUDE.md rule 4).
 */
export async function updateSettings(patch: { dailyReviewCap: DailyReviewCap }): Promise<void> {
  await request('/me/settings', { method: 'PATCH', body: JSON.stringify(patch) });
}

/** GET /practice — progress, focus areas and recent wins for the Practice tab. */
export async function getPracticeOverview(): Promise<PracticeOverview> {
  return request('/practice');
}

/**
 * POST /cards/:id/review — the only path that changes a card's status
 * (the AI never does). Two looks per session, as in the prototype:
 * - first look + Easy → Mastered, done for today;
 * - first look + anything else → Learning, comes back once more this session;
 * - second look → stays Learning, done for today, whatever the rating.
 */
export async function rateCard(cardId: string, rating: Rating): Promise<ReviewResult> {
  return post(`/cards/${encodeURIComponent(cardId)}/review`, { rating });
}

/**
 * GET /cards?status=&from=&to=&page= — "All my sentences": filtered by
 * status and by the day the sentence was said, newest first, 6 per page.
 */
export async function getSentences(query: SentenceQuery): Promise<SentencePage> {
  const params = new URLSearchParams({ status: query.statuses.join(','), page: String(query.page) });
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  return request(`/cards?${params}`);
}

/**
 * GET /cards/challenge — Today's challenge: up to 2 sentences, always from
 * "learning". Only when there are none in "learning" it falls back to
 * "new" ones (oldest first), as a last resort. Never "mastered".
 */
export async function getChallengeCards(): Promise<Flashcard[]> {
  return request('/cards/challenge');
}

// ---- Conversation pipeline (turn-based, see CLAUDE.md) ----

/** POST /conversations — opens a conversation, returns Monty's greeting. */
export async function startConversation(): Promise<{ id: string; greeting: string }> {
  return post('/conversations');
}

/**
 * POST /conversations/:id/transcribe — cloud STT of one recorded turn,
 * uploaded as multipart field "audio". Never device STT: it autocorrects,
 * and we need the mistakes as said.
 */
export async function transcribeTurn(conversationId: string, turn: RecordedTurn): Promise<string> {
  if (!turn.uri) throw new Error('No recording to transcribe');
  const form = new FormData();
  if (Platform.OS === 'web') {
    // the web recorder gives a blob: URL
    const blob = await (await fetch(turn.uri)).blob();
    form.append('audio', blob, 'turn.webm');
  } else {
    // The global fetch is expo/fetch, which rejects React Native's
    // { uri, name, type } parts; a File (a Blob) works. Its name keeps the
    // recording's extension (.m4a), which tells STT the format.
    form.append('audio', new File(turn.uri));
  }
  const { text } = await request<{ text: string }>(
    `/conversations/${encodeURIComponent(conversationId)}/transcribe`,
    { method: 'POST', body: form },
  );
  return text;
}

/** POST /conversations/:id/reply — cheap text model generates Monty's next line. */
export async function getMontyReply(conversationId: string, history: TalkLine[]): Promise<string> {
  const { text } = await post<{ text: string }>(`/conversations/${encodeURIComponent(conversationId)}/reply`, {
    history,
  });
  return text;
}

/** POST /conversations/:id/end — triggers the end-to-end analysis. */
export async function endConversation(
  conversationId: string,
  transcript: TalkLine[],
  durationSec: number,
): Promise<void> {
  await post(`/conversations/${encodeURIComponent(conversationId)}/end`, { transcript, durationSec });
}

/**
 * GET /conversations/:id/recap — waits for the analysis started by
 * endConversation and returns what Monty found.
 */
export async function getConversationRecap(conversationId: string): Promise<ConversationRecap> {
  return request(`/conversations/${encodeURIComponent(conversationId)}/recap`);
}

import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import { cards, conversations, hideChipsDays } from '../db/mockStore.js';
import { HttpError } from '../middleware/errorHandler.js';
import type { Card } from '../models/card.js';
import type { Conversation } from '../models/conversation.js';
import type { User } from '../models/auth.js';
import { analyzeConversation, generateReply, transcribe } from '../services/openai.js';
import type { ConversationDetail, ConversationRecap, ConversationSummary, TalkLine } from '../types/api.js';
import { isLocalDay } from '../utils/dates.js';
import { currentUser, toFlashcard, userDay } from './shared.js';

// ---- Recent conversations: one entry per day (CLAUDE.md) ----

/** The analyzed sessions of each day, added up into one entry. The day ("YYYY-MM-DD") is its id. */
function daySummaries(user: User): ConversationSummary[] {
  const byDay = new Map<string, Conversation[]>();
  for (const c of conversations) {
    if (c.userId !== user.id || c.status !== 'analyzed') continue;
    byDay.set(c.day, [...(byDay.get(c.day) ?? []), c]);
  }
  return [...byDay.entries()]
    .map(([day, sessions]) => {
      const first = sessions.reduce((a, b) => (a.startedAt <= b.startedAt ? a : b));
      const seconds = sessions.reduce((sum, s) => sum + s.durationSec, 0);
      return {
        id: day,
        startedAt: first.startedAt.toISOString(),
        minutes: Math.max(1, Math.round(seconds / 60)),
        grammarCount: sessions.reduce((sum, s) => sum + s.grammarCount, 0),
        naturalCount: sessions.reduce((sum, s) => sum + s.naturalCount, 0),
        ...(hideChipsDays.has(day) && { hideChips: true }),
      };
    })
    .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
}

/** GET /conversations?limit=3 — most recent days first. */
export async function list(req: Request, res: Response) {
  const user = currentUser(req);
  const limit = Math.max(1, Number(req.query.limit) || 3);
  res.json(daySummaries(user).slice(0, limit));
}

/** GET /conversations/:day — one day of Recent conversations, with the sentences it produced. */
export async function get(req: Request, res: Response) {
  const user = currentUser(req);
  const day = req.params.id;
  const summary = isLocalDay(day) ? daySummaries(user).find((d) => d.id === day) : undefined;
  if (!summary) throw new HttpError(404, 'Conversation not found');

  const sessionIds = new Set(
    conversations.filter((c) => c.userId === user.id && c.day === day).map((c) => c.id),
  );
  const detail: ConversationDetail = {
    ...summary,
    cards: cards.filter((c) => sessionIds.has(c.conversationId)).map(toFlashcard),
  };
  res.json(detail);
}

// ---- Talk pipeline: one session (turn-based, see CLAUDE.md) ----

function findSession(user: User, id: string | string[] | undefined): Conversation {
  const session = conversations.find((c) => c.id === id && c.userId === user.id);
  if (!session) throw new HttpError(404, 'Conversation not found');
  return session;
}

function parseLines(value: unknown): TalkLine[] {
  const valid =
    Array.isArray(value) &&
    value.every((l) => (l?.who === 'monty' || l?.who === 'you') && typeof l.text === 'string');
  if (!valid) throw new HttpError(400, 'Expected an array of { who: "monty" | "you", text }');
  return value.map((l: TalkLine) => ({ who: l.who, text: l.text }));
}

/** POST /conversations — opens a session. → { id, greeting } */
export async function start(req: Request, res: Response) {
  const user = currentUser(req);
  const now = new Date();
  const session: Conversation = {
    id: randomUUID(),
    userId: user.id,
    day: userDay(user, now),
    status: 'active',
    startedAt: now,
    endedAt: null,
    durationSec: 0,
    transcript: [],
    grammarCount: 0,
    naturalCount: 0,
  };
  conversations.push(session);
  res.status(201).json({ id: session.id, greeting: await generateReply([]) });
}

/**
 * POST /conversations/:id/transcribe — multipart, the recorded turn in
 * field `audio`. Cloud STT, never on-device: it autocorrects, and we need
 * the mistakes as said. → { text }
 */
export async function transcribeTurn(req: Request, res: Response) {
  const user = currentUser(req);
  const session = findSession(user, req.params.id);
  if (session.status !== 'active') throw new HttpError(409, 'Conversation already ended');
  if (!req.file) throw new HttpError(400, 'Missing audio file (multipart field "audio")');

  const text = await transcribe({ data: req.file.buffer, mimeType: req.file.mimetype });
  res.json({ text });
}

/** POST /conversations/:id/reply — { history: TalkLine[] } → { text }, Monty's next line. */
export async function reply(req: Request, res: Response) {
  const user = currentUser(req);
  const session = findSession(user, req.params.id);
  if (session.status !== 'active') throw new HttpError(409, 'Conversation already ended');

  const history = parseLines(req.body?.history);
  res.json({ text: await generateReply(history) });
}

/** Rule 6: nothing the user said → no analysis call. */
const hasAnalyzableContent = (transcript: TalkLine[]) =>
  transcript.some((line) => line.who === 'you' && line.text.trim().length > 0);

/** Running analyses, so the recap can wait for them (single server process). */
const analysisJobs = new Map<string, Promise<void>>();

/**
 * POST /conversations/:id/end — { transcript, durationSec }. Saves the
 * session and starts its end-to-end analysis right away (rule 5); the
 * recap waits for it. → 202
 */
export async function end(req: Request, res: Response) {
  const user = currentUser(req);
  const session = findSession(user, req.params.id);
  if (session.status !== 'active') throw new HttpError(409, 'Conversation already ended');

  const transcript = parseLines(req.body?.transcript);
  const durationSec = Number(req.body?.durationSec);
  if (!Number.isFinite(durationSec) || durationSec < 0) throw new HttpError(400, 'durationSec must be a number ≥ 0');

  session.transcript = transcript;
  session.durationSec = Math.round(durationSec);
  session.endedAt = new Date();

  if (!hasAnalyzableContent(transcript)) {
    session.status = 'skipped';
  } else {
    session.status = 'analyzing';
    const job = analyze(user, session).finally(() => analysisJobs.delete(session.id));
    analysisJobs.set(session.id, job);
  }
  res.status(202).end();
}

async function analyze(user: User, session: Conversation) {
  try {
    // pending = not mastered, learning first (the ones Today's challenge proposed)
    const pending = cards
      .filter((c) => c.userId === user.id && c.status !== 'mastered')
      .sort((a, b) => Number(b.status === 'learning') - Number(a.status === 'learning'));
    const analysis = await analyzeConversation(
      session.transcript,
      pending.map((c) => ({ id: c.id, better: c.better })),
    );

    // Rule 1: a win is only the informational flag — status stays as it is.
    const pendingById = new Map(pending.map((c) => [c.id, c]));
    for (const id of analysis.winCardIds) {
      const card = pendingById.get(id);
      if (!card) continue;
      card.win = true;
      card.winConversationId = session.id;
    }

    // Rule 3: every mistake becomes a card, no cap. All start as `new` in
    // the backlog; the daily caps decide when they reach the review.
    const created: Card[] = analysis.newCards.map((draft) => ({
      id: randomUUID(),
      userId: user.id,
      conversationId: session.id,
      type: draft.type,
      category: draft.category,
      said: draft.said,
      better: draft.better,
      es: draft.es,
      ipa: draft.ipa,
      why: draft.why,
      status: 'new',
      win: false,
      winConversationId: null,
      dueAt: session.startedAt,
      createdAt: session.startedAt,
    }));
    cards.push(...created);

    session.grammarCount = created.filter((c) => c.type === 'grammar').length;
    session.naturalCount = created.filter((c) => c.type === 'natural').length;
    session.status = 'analyzed';
  } catch (err) {
    console.error(`[analysis] conversation ${session.id} failed`, err);
    session.status = 'failed';
  }
}

/** GET /conversations/:id/recap — waits for the analysis and returns what Monty found. */
export async function getRecap(req: Request, res: Response) {
  const user = currentUser(req);
  const session = findSession(user, req.params.id);
  await analysisJobs.get(session.id);

  if (session.status === 'active') throw new HttpError(409, 'Conversation has not ended');
  if (session.status === 'failed') throw new HttpError(502, 'The analysis failed');

  const analyzed = session.status === 'analyzed';
  const recap: ConversationRecap = {
    conversationId: session.id,
    durationSec: session.durationSec,
    analyzed,
    wins: analyzed ? cards.filter((c) => c.winConversationId === session.id).map(toFlashcard) : [],
    newCards: analyzed ? cards.filter((c) => c.conversationId === session.id).map(toFlashcard) : [],
  };
  res.json(recap);
}

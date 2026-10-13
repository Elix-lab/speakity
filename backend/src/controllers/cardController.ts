import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import { CHALLENGE_SIZE, INTERVAL_DAYS, SENTENCES_PAGE_SIZE } from '../config/constants.js';
import { cards, reviews } from '../db/mockStore.js';
import { HttpError } from '../middleware/errorHandler.js';
import type { CardStatus, Rating, ReviewResult, SentencePage } from '../types/api.js';
import { daysFromNow, isLocalDay } from '../utils/dates.js';
import { dailyQueue, todaysReviews } from './reviewQueue.js';
import { currentUser, toFlashcard, userDay } from './shared.js';

const RATINGS: Rating[] = ['again', 'hard', 'good', 'easy'];
const STATUSES: CardStatus[] = ['new', 'learning', 'mastered'];

/** GET /cards/due — what's left of today's review, already under both caps (rule 4). */
export async function getDue(req: Request, res: Response) {
  const user = currentUser(req);
  res.json(dailyQueue(user).map(toFlashcard));
}

/**
 * POST /cards/:id/review — { rating }. The only path that changes a card's
 * status (rule 1). Two looks per session, as in the prototype:
 * - first look + Easy → Mastered, done for today;
 * - first look + anything else → Learning, comes back once more this session;
 * - second look → stays Learning, done for today, whatever the rating.
 */
export async function review(req: Request, res: Response) {
  const user = currentUser(req);
  const rating = req.body?.rating as Rating;
  if (!RATINGS.includes(rating)) throw new HttpError(400, `rating must be one of ${RATINGS.join(', ')}`);

  const card = cards.find((c) => c.id === req.params.id && c.userId === user.id);
  if (!card) throw new HttpError(404, 'Card not found');

  const looks = todaysReviews(user).filter((r) => r.cardId === card.id).length + 1;
  const statusBefore = card.status;
  const settled = looks > 1 || rating === 'easy';
  card.status = looks === 1 && rating === 'easy' ? 'mastered' : 'learning';
  if (settled) card.dueAt = daysFromNow(INTERVAL_DAYS[rating]);

  const now = new Date();
  reviews.push({
    id: randomUUID(),
    userId: user.id,
    cardId: card.id,
    rating,
    statusBefore,
    statusAfter: card.status,
    settled,
    day: userDay(user, now),
    reviewedAt: now,
  });

  const result: ReviewResult = { status: card.status, settled };
  res.json(result);
}

/**
 * GET /cards?status=new,learning&from=YYYY-MM-DD&to=YYYY-MM-DD&page=1 —
 * "All my sentences": filtered by status and by the day the sentence was
 * said, newest first. `status` may be comma-separated or repeated; no
 * status means all of them.
 */
export async function list(req: Request, res: Response) {
  const user = currentUser(req);
  const statusParam = ([] as unknown[]).concat(req.query.status ?? []).join(',');
  const statuses = statusParam
    ? statusParam.split(',').filter((s): s is CardStatus => STATUSES.includes(s as CardStatus))
    : STATUSES;
  const from = isLocalDay(req.query.from) ? req.query.from : null;
  const to = isLocalDay(req.query.to) ? req.query.to : null;

  const matches = cards
    .filter((c) => {
      const day = userDay(user, c.createdAt);
      return (
        c.userId === user.id &&
        statuses.includes(c.status) &&
        (!from || day >= from) &&
        (!to || day <= to)
      );
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const pageCount = Math.max(1, Math.ceil(matches.length / SENTENCES_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(req.query.page) || 1), pageCount);
  const result: SentencePage = {
    items: matches.slice((page - 1) * SENTENCES_PAGE_SIZE, page * SENTENCES_PAGE_SIZE).map(toFlashcard),
    total: matches.length,
    page,
    pageCount,
  };
  res.json(result);
}

/**
 * GET /cards/challenge — Today's challenge: up to 2 sentences, always from
 * "learning". Only when there are none in "learning" it falls back to "new"
 * ones (oldest first). Never "mastered".
 */
export async function getChallenge(req: Request, res: Response) {
  const user = currentUser(req);
  const userCards = cards.filter((c) => c.userId === user.id);
  const learning = userCards.filter((c) => c.status === 'learning');
  const picked = learning.length
    ? learning.slice(0, CHALLENGE_SIZE)
    : userCards
        .filter((c) => c.status === 'new')
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .slice(0, CHALLENGE_SIZE);
  res.json(picked.map(toFlashcard));
}

import type { Request } from 'express';
import { users } from '../db/mockStore.js';
import { HttpError } from '../middleware/errorHandler.js';
import type { Card } from '../models/card.js';
import type { User } from '../models/auth.js';
import type { Flashcard } from '../types/api.js';
import { toLocalDay } from '../utils/dates.js';

/** The signed-in user's row. */
export function currentUser(req: Request): User {
  const found = users.find((u) => u.id === req.userId);
  if (!found) throw new HttpError(401, 'Not signed in');
  return found;
}

/** The user's local calendar day for `date` (YYYY-MM-DD). */
export const userDay = (user: User, date = new Date()) => toLocalDay(date, user.timezone || undefined);

/** Card row → what the app receives (no userId, ISO dates). */
export const toFlashcard = (card: Card): Flashcard => ({
  id: card.id,
  conversationId: card.conversationId,
  type: card.type,
  category: card.category,
  said: card.said,
  better: card.better,
  es: card.es,
  ipa: card.ipa,
  why: card.why,
  status: card.status,
  win: card.win,
  dueAt: card.dueAt.toISOString(),
  createdAt: card.createdAt.toISOString(),
});

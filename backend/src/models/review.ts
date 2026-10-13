import { boolean, date, index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth.js';
import { cardStatus, cards } from './card.js';

export const rating = pgEnum('rating', ['again', 'hard', 'good', 'easy']);

/**
 * One rating of a card. Today's rows per user are what the daily caps
 * (rule 4) are counted from:
 * - reviewed today        = settled rows today (against the daily review cap)
 * - new cards activated   = rows today with statusBefore = 'new' (against 5/day)
 * - first or second look  = rows today for that card
 * - "Mastered today"      = settled rows today with statusAfter = 'mastered'
 */
export const reviews = pgTable(
  'reviews',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    cardId: uuid()
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    rating: rating().notNull(),
    statusBefore: cardStatus().notNull(),
    statusAfter: cardStatus().notNull(),
    /** Done for today (counts toward the daily review cap). */
    settled: boolean().notNull(),
    /** The user's local calendar day of the rating (YYYY-MM-DD). */
    day: date({ mode: 'string' }).notNull(),
    reviewedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('reviews_user_day_idx').on(t.userId, t.day),
    index('reviews_card_day_idx').on(t.cardId, t.day),
  ],
);

export type Review = typeof reviews.$inferSelect;

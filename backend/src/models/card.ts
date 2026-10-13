import { boolean, index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth.js';
import { conversations } from './conversation.js';

export const cardStatus = pgEnum('card_status', ['new', 'learning', 'mastered']);
export const cardType = pgEnum('card_type', ['grammar', 'natural']);

/**
 * A flashcard created by the analysis of a conversation (no cap per
 * conversation — rule 3). It starts as `new` in the backlog; the daily
 * caps decide when it reaches the review.
 *
 * Rule 1: `status` is only ever written by the review endpoint
 * (POST /cards/:id/review). The AI can create cards and set `win`, never
 * touch `status`.
 */
export const cards = pgTable(
  'cards',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    /** The session whose analysis created it. */
    conversationId: uuid()
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    type: cardType().notNull(),
    category: text().notNull(),
    said: text().notNull(),
    better: text().notNull(),
    es: text().notNull(),
    ipa: text().notNull(),
    why: text().notNull(),
    status: cardStatus().notNull().default('new'),
    /** Informational: the AI saw it used correctly in a later session. Never touches status. */
    win: boolean().notNull().default(false),
    /** The session where that happened (its recap lists it as a win). */
    winConversationId: uuid().references(() => conversations.id, { onDelete: 'set null' }),
    dueAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    /** When the sentence was said: its session's start. */
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('cards_user_status_due_idx').on(t.userId, t.status, t.dueAt),
    index('cards_conversation_idx').on(t.conversationId),
  ],
);

export type Card = typeof cards.$inferSelect;

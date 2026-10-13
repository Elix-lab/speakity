import { date, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { TalkLine } from '../types/api.js';
import { user } from './auth.js';

/**
 * - active:    the user is still talking
 * - analyzing: ended, analysis running (the recap waits for it)
 * - analyzed:  flashcards and wins are in
 * - skipped:   nothing analyzable was said — no analysis call (rule 6)
 * - failed:    the analysis call failed
 */
export const conversationStatus = pgEnum('conversation_status', [
  'active',
  'analyzing',
  'analyzed',
  'skipped',
  'failed',
]);

/**
 * One talk session (what Talk → recap → summary work with). "Recent
 * conversations" shows one entry per day instead: sessions grouped by
 * (userId, day), with minutes and counts added up. Skipped sessions don't
 * make an entry.
 */
export const conversations = pgTable(
  'conversations',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    /** The user's local calendar day the session started on (YYYY-MM-DD). */
    day: date({ mode: 'string' }).notNull(),
    status: conversationStatus().notNull().default('active'),
    startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp({ withTimezone: true }),
    durationSec: integer().notNull().default(0),
    /** Full transcript, sent by the app when the session ends. */
    transcript: jsonb().$type<TalkLine[]>().notNull().default([]),
    /** Cards the analysis created, by type (Recent conversations chips). */
    grammarCount: integer().notNull().default(0),
    naturalCount: integer().notNull().default(0),
  },
  (t) => [index('conversations_user_day_idx').on(t.userId, t.day)],
);

export type Conversation = typeof conversations.$inferSelect;

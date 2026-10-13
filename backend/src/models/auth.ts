import { sql } from 'drizzle-orm';
import { boolean, check, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { DEFAULT_DAILY_REVIEW_CAP, DEFAULT_MINUTES_GOAL } from '../config/constants.js';

/**
 * BetterAuth's tables (user, session, account, verification). The field
 * names are the ones BetterAuth expects — don't rename them. Speakity's
 * own per-user settings live as extra columns on `users` (declared to
 * BetterAuth as additionalFields in middleware/auth.ts).
 */

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const user = pgTable(
  'users',
  {
    id: text().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: boolean().notNull().default(false),
    image: text(),
    ...timestamps,

    // ---- Speakity settings ----
    /** Daily review cap, new + due (CLAUDE.md rule 4). The 5 new/day cap is fixed, not stored. */
    dailyReviewCap: integer().notNull().default(DEFAULT_DAILY_REVIEW_CAP),
    minutesGoal: integer().notNull().default(DEFAULT_MINUTES_GOAL),
    /** IANA zone, e.g. "America/Montevideo". "Today" and the daily caps follow it. */
    timezone: text().notNull().default('UTC'),
  },
  (t) => [check('users_daily_review_cap_check', sql`${t.dailyReviewCap} in (10, 15, 20, 25)`)],
);

export const session = pgTable('sessions', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text().notNull().unique(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  ...timestamps,
});

export const account = pgTable('accounts', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text().notNull(),
  providerId: text().notNull(),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp({ withTimezone: true }),
  refreshTokenExpiresAt: timestamp({ withTimezone: true }),
  scope: text(),
  password: text(),
  ...timestamps,
});

export const verification = pgTable('verifications', {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  ...timestamps,
});

export type User = typeof user.$inferSelect;

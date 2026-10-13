import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DEFAULT_DAILY_REVIEW_CAP, DEFAULT_MINUTES_GOAL } from './constants.js';
import { env } from './env.js';
import { db } from '../db/index.js';
import { account, session, user, verification } from '../models/auth.js';

/**
 * BetterAuth, mounted at /api/auth (see app.ts).
 *
 * Login methods are still to be decided. To turn one on:
 * - email/password: `emailAndPassword: { enabled: true }`
 * - Google: `socialProviders: { google: { clientId, clientSecret } }`
 * The Expo app will also need the `@better-auth/expo` plugin here and on
 * the client.
 */
export const auth = betterAuth({
  baseURL: env.betterAuthUrl,
  secret: env.betterAuthSecret,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification },
  }),
  trustedOrigins: env.corsOrigins,
  user: {
    additionalFields: {
      dailyReviewCap: { type: 'number', defaultValue: DEFAULT_DAILY_REVIEW_CAP, input: false },
      minutesGoal: { type: 'number', defaultValue: DEFAULT_MINUTES_GOAL, input: false },
      timezone: { type: 'string', defaultValue: 'UTC', input: true },
    },
  },
});

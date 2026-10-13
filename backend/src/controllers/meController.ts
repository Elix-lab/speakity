import type { Request, Response } from 'express';
import { DAILY_REVIEW_CAP_OPTIONS, type DailyReviewCap } from '../config/constants.js';
import { conversations, mockStreakDays, mockWeek } from '../db/mockStore.js';
import { HttpError } from '../middleware/errorHandler.js';
import type { TodaySummary, WeekStats } from '../types/api.js';
import { dailyQueue, todaysReviews } from './reviewQueue.js';
import { currentUser, userDay } from './shared.js';

/** GET /me/today */
export async function getToday(req: Request, res: Response) {
  const user = currentUser(req);
  const today = userDay(user);
  const secondsToday = conversations
    .filter((c) => c.userId === user.id && c.day === today)
    .reduce((sum, c) => sum + c.durationSec, 0);

  const summary: TodaySummary = {
    streakDays: mockStreakDays, // mock-only: will come from the days with sessions
    minutesToday: Math.round(secondsToday / 60),
    minutesGoal: user.minutesGoal,
    // The goal is a target, not a lock (rule 7); a plan limit may set this later.
    talkLimitReached: false,
    dueToday: dailyQueue(user).length,
    reviewedToday: todaysReviews(user).filter((r) => r.settled).length,
  };
  res.json(summary);
}

/** GET /me/week — current week, Monday first. */
export async function getWeek(req: Request, res: Response) {
  currentUser(req);
  const week: WeekStats = mockWeek; // mock-only: fixed example data, as in the frontend
  res.json(week);
}

/** GET /me/settings — read once when the app starts. */
export async function getSettings(req: Request, res: Response) {
  const user = currentUser(req);
  res.json({ dailyReviewCap: user.dailyReviewCap });
}

/** PATCH /me/settings — { dailyReviewCap }. Applies right away, also today (rule 4). */
export async function updateSettings(req: Request, res: Response) {
  const user = currentUser(req);
  const { dailyReviewCap } = req.body ?? {};
  if (!DAILY_REVIEW_CAP_OPTIONS.includes(dailyReviewCap)) {
    throw new HttpError(400, `dailyReviewCap must be one of ${DAILY_REVIEW_CAP_OPTIONS.join(', ')}`);
  }
  user.dailyReviewCap = dailyReviewCap as DailyReviewCap;
  user.updatedAt = new Date();
  res.status(204).end();
}

/** Fixed, not user-configurable (CLAUDE.md rule 4). */
export const NEW_CARDS_PER_DAY = 5;

/** The user picks the daily review cap (new + due) among these (CLAUDE.md rule 4). */
export const DAILY_REVIEW_CAP_OPTIONS = [10, 15, 20, 25] as const;
export type DailyReviewCap = (typeof DAILY_REVIEW_CAP_OPTIONS)[number];
export const DEFAULT_DAILY_REVIEW_CAP: DailyReviewCap = 15;

export const DEFAULT_MINUTES_GOAL = 5;

/** "All my sentences" page size. */
export const SENTENCES_PAGE_SIZE = 6;

/** Today's challenge: at most this many sentences. */
export const CHALLENGE_SIZE = 2;

/**
 * Days until a settled card comes back. "Again" = 10m is the in-session
 * second look, handled by `settled: false`, so the minimum here is 1 day.
 */
export const INTERVAL_DAYS = { again: 1, hard: 1, good: 3, easy: 6 } as const;

/**
 * Response shapes the frontend expects. Copy of frontend/lib/types.ts (the
 * contract): if one changes, change the other. Only the types that travel
 * over HTTP are here.
 */

/** Only the rating system moves a card between states — never the AI. */
export type CardStatus = 'new' | 'learning' | 'mastered';

export type Rating = 'again' | 'hard' | 'good' | 'easy';

/** Top-level kind shown as a tag/chip. */
export type CardType = 'grammar' | 'natural';

export type Flashcard = {
  id: string;
  conversationId: string;
  type: CardType;
  /** Finer grouping, e.g. "Prepositions", "Verb forms". */
  category: string;
  /** What the user actually said. */
  said: string;
  /** The corrected full sentence. */
  better: string;
  /** The sentence in the user's language. */
  es: string;
  ipa: string;
  why: string;
  status: CardStatus;
  /** Informational flag set by the AI when used correctly later. Never touches status. */
  win: boolean;
  dueAt: string; // ISO date
  /** When the sentence was said (its conversation's date). */
  createdAt: string; // ISO date
};

/** What the backend answers after a rating. */
export type ReviewResult = {
  status: CardStatus;
  /**
   * False = first look and not Easy: the card comes back once more at the
   * end of this session. True = done for today (counts toward the daily cap).
   */
  settled: boolean;
};

export type CardStats = Record<CardStatus, number>;

export type FocusArea = CardStats & {
  category: string;
  total: number;
};

export type SentencePage = {
  items: Flashcard[];
  total: number;
  page: number;
  pageCount: number;
};

export type PracticeOverview = {
  stats: CardStats;
  /** Most still-to-learn first. */
  focusAreas: FocusArea[];
  /** Cards flagged `.win` by the AI, up to 3. */
  corrected: Flashcard[];
  /** Cards the user rated into Mastered today, up to 3. */
  masteredToday: Flashcard[];
};

export type TodaySummary = {
  streakDays: number;
  minutesToday: number;
  minutesGoal: number;
  /** True when today's talk time is used up — Start talking is disabled. */
  talkLimitReached: boolean;
  /** Cards still due today, already capped by the daily review limit. */
  dueToday: number;
  reviewedToday: number;
};

/** One row of "Recent conversations": everything spoken in one day. */
export type ConversationSummary = {
  id: string;
  startedAt: string; // ISO date
  minutes: number;
  grammarCount: number;
  naturalCount: number;
  hideChips?: boolean;
};

export type ConversationDetail = ConversationSummary & {
  cards: Flashcard[];
};

export type WeekStats = {
  /** Monday-first. Whether the daily goal was met that day. */
  daysDone: boolean[];
  /** Monday-first minutes spoken per day. */
  minutesPerDay: number[];
  conversations: number;
};

export type TalkLine = {
  who: 'monty' | 'you';
  text: string;
};

/** Result of a session's end-to-end analysis ("That's a wrap!"). */
export type ConversationRecap = {
  conversationId: string;
  durationSec: number;
  analyzed: boolean;
  wins: Flashcard[];
  newCards: Flashcard[];
};

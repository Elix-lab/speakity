/**
 * Shared domain types. These mirror what the backend will return; keep
 * them in sync once the real API exists.
 */

/** Only the rating system moves a card between states — never the AI. */
export type CardStatus = 'new' | 'learning' | 'mastered';

export type Rating = 'again' | 'hard' | 'good' | 'easy';

/** Top-level kind shown as a tag/chip (prototype: TAG). */
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

/** How many of the user's cards are in each state (Practice progress card). */
export type CardStats = Record<CardStatus, number>;

/** One mistake category on Practice ("What you're improving"). */
export type FocusArea = CardStats & {
  category: string;
  total: number;
};

/** "All my sentences" filters. Dates are local calendar days, YYYY-MM-DD. */
export type SentenceQuery = {
  statuses: CardStatus[];
  from: string | null;
  to: string | null;
  page: number;
};

export type SentencePage = {
  items: Flashcard[];
  /** Matches across all pages. */
  total: number;
  page: number;
  pageCount: number;
};

/** Everything below the header on the Practice tab. */
export type PracticeOverview = {
  stats: CardStats;
  /** Most still-to-learn first. */
  focusAreas: FocusArea[];
  /** Cards flagged `.win` by the AI (said right in a later conversation), up to 3. */
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

/**
 * One row of "Recent conversations": everything spoken in one day. Several
 * short sessions the same day add up here (minutes and corrections).
 */
export type ConversationSummary = {
  id: string;
  startedAt: string; // ISO date
  minutes: number;
  grammarCount: number;
  naturalCount: number;
  /** Hide the grammar/natural chips on the list row (e.g. nothing new to show). */
  hideChips?: boolean;
};

/** One past conversation and the sentences its analysis found. */
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

/**
 * Talk screen state:
 * - speaking:  Monty is talking (TTS) — mic disabled
 * - idle:      nobody is talking — mic enabled, tap to start your turn
 * - listening: you are talking (recording) — tap the mic to end your turn
 * - thinking:  transcribing + generating Monty's reply — mic disabled
 * - muted:     conversation paused — mic disabled
 */
export type TalkMode = 'speaking' | 'idle' | 'listening' | 'thinking' | 'muted';

export type TalkLine = {
  who: 'monty' | 'you';
  text: string;
};

/**
 * Result of a conversation's end-to-end analysis ("That's a wrap!").
 * A conversation too short to say anything about skips the analysis call
 * entirely (CLAUDE.md rule 6): `analyzed` is false and both lists are empty.
 */
export type ConversationRecap = {
  conversationId: string;
  durationSec: number;
  analyzed: boolean;
  /** Pending cards the AI saw used correctly this time (`.win`, never `.status`). */
  wins: Flashcard[];
  /** New flashcards created from this conversation's mistakes — no cap. */
  newCards: Flashcard[];
};

/** A recorded user turn, ready to upload for cloud transcription. */
export type RecordedTurn = {
  uri: string | null;
  durationMs: number;
};

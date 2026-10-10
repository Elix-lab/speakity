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

export type ConversationSummary = {
  id: string;
  title: string;
  startedAt: string; // ISO date
  minutes: number;
  grammarCount: number;
  naturalCount: number;
  /** Hide the grammar/natural chips on the list row (e.g. nothing new to show). */
  hideChips?: boolean;
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
 * - speaking:  Mia is talking (TTS) — mic disabled
 * - idle:      nobody is talking — mic enabled, tap to start your turn
 * - listening: you are talking (recording) — tap the mic to end your turn
 * - thinking:  transcribing + generating Mia's reply — mic disabled
 * - muted:     conversation paused — mic disabled
 */
export type TalkMode = 'speaking' | 'idle' | 'listening' | 'thinking' | 'muted';

export type TalkLine = {
  who: 'mia' | 'you';
  text: string;
};

/** A recorded user turn, ready to upload for cloud transcription. */
export type RecordedTurn = {
  uri: string | null;
  durationMs: number;
};

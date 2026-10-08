import type { ConversationSummary, Flashcard, TodaySummary, WeekStats } from './types';

// Example data until the backend exists (values from prototype.html state).
// Delete once lib/api.ts calls the real backend.

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const mockToday: TodaySummary = {
  streakDays: 3,
  minutesToday: 0,
  minutesGoal: 5,
  talkLimitReached: false,
  dueToday: 5,
  reviewedToday: 0,
};

export const mockWeek: WeekStats = {
  daysDone: [true, true, true, false, false, false, false],
  minutesPerDay: [14, 9, 19, 0, 0, 0, 0],
  conversations: 6,
};

export const mockConversations: ConversationSummary[] = [
  { id: 'conv1', title: 'Weekend plans', startedAt: daysAgo(1), minutes: 8, grammarCount: 3, naturalCount: 0 },
  { id: 'conv2', title: 'Job interview', startedAt: daysAgo(3), minutes: 5, grammarCount: 0, naturalCount: 2 },
  {
    id: 'conv3',
    title: 'Coffee with friends',
    startedAt: daysAgo(5),
    minutes: 6,
    grammarCount: 2,
    naturalCount: 1,
    hideChips: true,
  },
  { id: 'conv4', title: 'Family dinner', startedAt: daysAgo(8), minutes: 7, grammarCount: 1, naturalCount: 2 },
];

export const mockCards: Flashcard[] = [
  {
    id: 'o1',
    conversationId: 'conv1',
    type: 'grammar',
    category: 'Verb forms',
    said: "I'm agree with you",
    better: 'I agree with you',
    es: 'Estoy de acuerdo contigo',
    ipa: '/aɪ əˈɡriː wɪð juː/',
    why: '“Agree” is a verb by itself. Don’t add “to be”.',
    status: 'learning',
    win: false,
    dueAt: daysAgo(0),
  },
  {
    id: 'o3',
    conversationId: 'conv1',
    type: 'grammar',
    category: 'Prepositions',
    said: 'Depends of the weather',
    better: 'It depends on the weather',
    es: 'Depende del clima',
    ipa: '/ɪt dɪˈpɛndz ɑːn ðə ˈwɛðɚ/',
    why: 'The preposition is “on”, and the sentence needs “it”.',
    status: 'learning',
    win: false,
    dueAt: daysAgo(0),
  },
  {
    id: 'm3',
    conversationId: 'conv3',
    type: 'natural',
    category: 'Natural phrasing',
    said: 'I stayed without battery',
    better: 'I ran out of battery',
    es: 'Me quedé sin batería',
    ipa: '/aɪ ræn aʊt əv ˈbætɚi/',
    why: '“Run out of” is the natural way to say it.',
    status: 'mastered',
    win: true,
    dueAt: daysAgo(-4),
  },
];

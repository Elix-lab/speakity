import type { CardType, TalkLine } from '../types/api.js';

/**
 * Calls to OpenAI. Pure functions: they send and receive, and leave every
 * business decision (what to save, what to skip, rule 1 and rule 6) to the
 * controllers.
 *
 * STUBS for now — they answer with the frontend's example data and never
 * call the API. Real version: cloud STT (never on-device, it autocorrects
 * the mistakes we need) and a cheap text model. Provider/model still to be
 * confirmed (CLAUDE.md "Próximos pasos").
 */

export type AudioInput = {
  data: Buffer;
  mimeType: string;
};

/** A card the analysis proposes. No status: new cards always start as `new`. */
export type CardDraft = {
  type: CardType;
  category: string;
  said: string;
  better: string;
  es: string;
  ipa: string;
  why: string;
};

export type ConversationAnalysis = {
  /** Every real mistake found — no cap (rule 3). */
  newCards: CardDraft[];
  /** Pending cards the user said correctly this time (they get `.win`, never a status change). */
  winCardIds: string[];
};

/** Cloud speech-to-text of one user turn, mistakes kept as said. */
export async function transcribe(_audio: AudioInput): Promise<string> {
  // stub: rotates through the prototype's scripted user lines
  const line = MOCK_USER_LINES[stubTurn % MOCK_USER_LINES.length];
  stubTurn++;
  return line;
}

/** Monty's next line, from a cheap text model. An empty history gives the greeting. */
export async function generateReply(history: TalkLine[]): Promise<string> {
  // stub: same script as the frontend mock
  const montyTurns = history.filter((line) => line.who === 'monty').length;
  return MOCK_MONTY_LINES[montyTurns % MOCK_MONTY_LINES.length];
}

/**
 * End-to-end analysis of a finished session: the mistakes it contains and
 * which pending cards were used correctly.
 */
export async function analyzeConversation(
  _transcript: TalkLine[],
  pendingCards: { id: string; better: string }[],
): Promise<ConversationAnalysis> {
  // stub: like the prototype's recap — the NEW list, and the first two pending cards as wins
  return {
    newCards: MOCK_ANALYSIS_CARDS,
    winCardIds: pendingCards.slice(0, 2).map((card) => card.id),
  };
}

// ---- stub data (prototype.html), delete with the stubs ----

let stubTurn = 0;

const MOCK_MONTY_LINES = [
  'Hi Ana! What have you been up to today?',
  'Sounds like a lot! Tell me more about that.',
  'I love that. Tell me more about the beach. What do you do there?',
];

const MOCK_USER_LINES = [
  "Honestly, it's been busy. I go to the office yesterday and I'm going to the office tomorrow too.",
  'I would sleep in, walk on the beach with my dog. I have 25 years, so I want to enjoy it!',
  "I've been meaning to try that new place near the pier.",
];

const MOCK_ANALYSIS_CARDS: CardDraft[] = [
  { type: 'grammar', category: 'Verb forms', es: 'Tengo 25 años', said: 'I have 25 years', better: "I'm 25 years old", ipa: '/aɪm ˈtwɛnti faɪv jɪrz oʊld/', why: 'English uses “to be” for age, not “to have”.' },
  { type: 'grammar', category: 'Verb tenses', es: 'Ayer fui a la oficina', said: 'I go to the office yesterday', better: 'I went to the office yesterday', ipa: '/aɪ wɛnt tə ði ˈɔːfɪs ˈjɛstɚdeɪ/', why: 'Use the past simple for something that already happened.' },
  { type: 'natural', category: 'Natural phrasing', es: 'Mañana me paso por la oficina', said: "I'm going to the office tomorrow", better: "I'll head to the office tomorrow", ipa: '/aɪl hɛd tə ði ˈɔːfɪs təˈmɑːroʊ/', why: '“Head to” sounds more relaxed in everyday speech.' },
  { type: 'natural', category: 'Natural phrasing', es: 'Estaba agotado, así que me acosté temprano', said: 'I was very tired, so I slept early', better: 'I was exhausted, so I turned in early', ipa: '/aɪ wʌz ɪɡˈzɔːstɪd soʊ aɪ tɝːnd ɪn ˈɝːli/', why: '“Exhausted” and “turn in” are what people actually say.' },
];

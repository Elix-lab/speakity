import type { Card } from '../models/card.js';
import type { Conversation } from '../models/conversation.js';
import type { Review } from '../models/review.js';
import type { User } from '../models/auth.js';
import type { WeekStats } from '../types/api.js';
import { daysFromNow, toLocalDay } from '../utils/dates.js';

/**
 * mock-only: in-memory tables with the frontend's example data
 * (frontend/lib/mockData.ts). Rows have the exact shape of the Drizzle
 * models, so the controllers can move to real queries one by one.
 * Everything resets when the server restarts. Delete this file once the
 * controllers query Supabase.
 */

export const MOCK_USER_ID = 'mock-user';

const daysAgo = (n: number) => daysFromNow(-n);

export const users: User[] = [
  {
    id: MOCK_USER_ID,
    name: 'Ana',
    email: 'ana@example.com',
    emailVerified: true,
    image: null,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
    dailyReviewCap: 15,
    minutesGoal: 5,
    // the server's zone, like the frontend mock (toLocalDay without a zone)
    timezone: '',
  },
];

// One session per past day, as in the frontend mock (its "conv1".."conv4").
const seedSession = (id: string, startedDaysAgo: number, minutes: number): Conversation => {
  const startedAt = daysAgo(startedDaysAgo);
  return {
    id,
    userId: MOCK_USER_ID,
    day: toLocalDay(startedAt),
    status: 'analyzed',
    startedAt,
    endedAt: new Date(startedAt.getTime() + minutes * 60_000),
    durationSec: minutes * 60,
    transcript: [],
    grammarCount: 0, // filled in from the cards below
    naturalCount: 0,
  };
};

export const conversations: Conversation[] = [
  seedSession('conv1', 1, 8),
  seedSession('conv2', 3, 5),
  seedSession('conv3', 5, 6),
  seedSession('conv4', 8, 7),
];

/** mock-only: days whose Recent conversations row hides its chips (frontend mock's `hideChips`). */
export const hideChipsDays = new Set([conversations[2].day]);

type CardSeed = Pick<Card, 'id' | 'type' | 'category' | 'said' | 'better' | 'es' | 'ipa' | 'why'>;

const card = (
  seed: CardSeed,
  conversationId: string,
  status: Card['status'],
  dueInDays: number,
  win = false,
): Card => ({
  ...seed,
  userId: MOCK_USER_ID,
  conversationId,
  status,
  win,
  winConversationId: null,
  dueAt: daysFromNow(dueInDays),
  createdAt: conversations.find((c) => c.id === conversationId)!.startedAt,
});

// Same cards as the frontend mock: 11 due + 8 new → only 4 new fit → 15 total (the default cap).
export const cards: Card[] = [
  // ---- Learning, due today (prototype OLD) ----
  card({ id: 'o1', type: 'grammar', category: 'Verb forms', es: 'Estoy de acuerdo contigo', said: "I'm agree with you", better: 'I agree with you', ipa: '/aɪ əˈɡriː wɪð juː/', why: '“Agree” is a verb by itself. Don’t add “to be”.' }, 'conv1', 'learning', -1),
  card({ id: 'o2', type: 'grammar', category: 'Quantity words', es: 'Tengo mucho trabajo por hacer', said: 'I have many work to do', better: 'I have a lot of work to do', ipa: '/aɪ hæv ə lɑːt əv wɝːk tə duː/', why: '“Work” is uncountable, so use “a lot of” or “much”.' }, 'conv1', 'learning', -1),
  card({ id: 'o3', type: 'grammar', category: 'Prepositions', es: 'Depende del clima', said: 'Depends of the weather', better: 'It depends on the weather', ipa: '/ɪt dɪˈpɛndz ɑːn ðə ˈwɛðɚ/', why: 'The preposition is “on”, and the sentence needs “it”.' }, 'conv1', 'learning', 0),
  card({ id: 'o4', type: 'natural', category: 'Verb forms', es: 'Tengo muchas ganas de verte', said: "I'm looking forward to see you", better: "I'm looking forward to seeing you", ipa: '/aɪm ˈlʊkɪŋ ˈfɔːrwɚd tə ˈsiːɪŋ juː/', why: 'After “look forward to”, use the -ing form.' }, 'conv2', 'learning', 0),
  card({ id: 'o5', type: 'natural', category: 'Word order', es: '¿Me puedes explicar esto?', said: 'Can you explain me this?', better: 'Can you explain this to me?', ipa: '/kæn juː ɪkˈspleɪn ðɪs tə miː/', why: '“Explain” takes “to” before the person.' }, 'conv2', 'learning', 0),
  // ---- Learning, due today (extra mock) ----
  card({ id: 'o6', type: 'grammar', category: 'Prepositions', es: 'Estoy pensando en mudarme', said: "I'm thinking in moving", better: "I'm thinking about moving", ipa: '/aɪm ˈθɪŋkɪŋ əˈbaʊt ˈmuːvɪŋ/', why: 'You think “about” something, not “in” it.' }, 'conv4', 'learning', 0),
  card({ id: 'o7', type: 'grammar', category: 'Verb tenses', es: 'Hace dos horas que te espero', said: "I'm waiting for you since two hours", better: "I've been waiting for you for two hours", ipa: '/aɪv bɪn ˈweɪtɪŋ fɔːr juː fɔːr tuː ˈaʊɚz/', why: 'Use the present perfect continuous with “for” + a length of time.' }, 'conv4', 'learning', 0),
  card({ id: 'o8', type: 'natural', category: 'Natural phrasing', es: 'Saqué una foto', said: 'I took out a photo', better: 'I took a photo', ipa: '/aɪ tʊk ə ˈfoʊtoʊ/', why: 'You “take” a photo. “Take out” means removing something.' }, 'conv4', 'learning', 0),
  card({ id: 'o9', type: 'grammar', category: 'Quantity words', es: 'Necesito más información', said: 'I need more informations', better: 'I need more information', ipa: '/aɪ niːd mɔːr ˌɪnfɚˈmeɪʃən/', why: '“Information” is uncountable. It has no plural.' }, 'conv2', 'learning', 0),
  card({ id: 'o10', type: 'natural', category: 'Natural phrasing', es: 'Tomé una decisión', said: 'I took a decision', better: 'I made a decision', ipa: '/aɪ meɪd ə dɪˈsɪʒən/', why: 'In English you “make” a decision.' }, 'conv1', 'learning', 0),
  card({ id: 'o11', type: 'grammar', category: 'Word order', es: 'Siempre llego tarde', said: 'I arrive always late', better: 'I always arrive late', ipa: '/aɪ ˈɔːlweɪz əˈraɪv leɪt/', why: '“Always” goes before the main verb.' }, 'conv3', 'learning', 0),
  // ---- New, waiting in the backlog (prototype NEW) ----
  card({ id: 'n1', type: 'grammar', category: 'Verb forms', es: 'Tengo 25 años', said: 'I have 25 years', better: "I'm 25 years old", ipa: '/aɪm ˈtwɛnti faɪv jɪrz oʊld/', why: 'English uses “to be” for age, not “to have”.' }, 'conv1', 'new', -1),
  card({ id: 'n2', type: 'grammar', category: 'Verb tenses', es: 'Ayer fui a la oficina', said: 'I go to the office yesterday', better: 'I went to the office yesterday', ipa: '/aɪ wɛnt tə ði ˈɔːfɪs ˈjɛstɚdeɪ/', why: 'Use the past simple for something that already happened.' }, 'conv1', 'new', -1),
  card({ id: 'n3', type: 'natural', category: 'Natural phrasing', es: 'Mañana me paso por la oficina', said: "I'm going to the office tomorrow", better: "I'll head to the office tomorrow", ipa: '/aɪl hɛd tə ði ˈɔːfɪs təˈmɑːroʊ/', why: '“Head to” sounds more relaxed in everyday speech.' }, 'conv1', 'new', -1),
  card({ id: 'n4', type: 'natural', category: 'Natural phrasing', es: 'Estaba agotado, así que me acosté temprano', said: 'I was very tired, so I slept early', better: 'I was exhausted, so I turned in early', ipa: '/aɪ wʌz ɪɡˈzɔːstɪd soʊ aɪ tɝːnd ɪn ˈɝːli/', why: '“Exhausted” and “turn in” are what people actually say.' }, 'conv1', 'new', -1),
  // ---- New (extra mock) ----
  card({ id: 'n5', type: 'grammar', category: 'Prepositions', es: 'Depende de ti', said: 'It depends of you', better: 'It depends on you', ipa: '/ɪt dɪˈpɛndz ɑːn juː/', why: '“Depend” always takes “on”.' }, 'conv4', 'new', 0),
  card({ id: 'n6', type: 'natural', category: 'Natural phrasing', es: 'Lo pasé muy bien', said: 'I passed it very well', better: 'I had a great time', ipa: '/aɪ hæd ə ɡreɪt taɪm/', why: '“Have a great time” is how English says it.' }, 'conv4', 'new', 0),
  card({ id: 'n7', type: 'grammar', category: 'Verb forms', es: 'Me hizo reír', said: 'She made me to laugh', better: 'She made me laugh', ipa: '/ʃi meɪd mi læf/', why: 'After “make someone”, use the verb without “to”.' }, 'conv4', 'new', 0),
  card({ id: 'n8', type: 'natural', category: 'Natural phrasing', es: 'Tengo hambre', said: 'I have hunger', better: "I'm hungry", ipa: '/aɪm ˈhʌŋɡri/', why: 'English uses “to be” + adjective for hunger.' }, 'conv4', 'new', 0),
  // ---- Mastered (prototype MASTERED) ----
  card({ id: 'm1', type: 'grammar', category: 'Verb forms', es: 'Estoy acostumbrado a madrugar', said: "I'm used to wake up early", better: "I'm used to waking up early", ipa: '/aɪm juːst tə ˈweɪkɪŋ ʌp ˈɝːli/', why: 'After “used to” (a habit), use the -ing form.' }, 'conv3', 'mastered', 4),
  card({ id: 'm2', type: 'grammar', category: 'Verb forms', es: 'Me dijo que vendría', said: 'He said me that he would come', better: 'He told me that he would come', ipa: '/hi toʊld mi ðæt hi wʊd kʌm/', why: '“Say” doesn’t take a person directly. “Tell” does.' }, 'conv3', 'mastered', 4, true),
  card({ id: 'm3', type: 'natural', category: 'Natural phrasing', es: 'Me quedé sin batería', said: 'I stayed without battery', better: 'I ran out of battery', ipa: '/aɪ ræn aʊt əv ˈbætɚi/', why: '“Run out of” is the natural way to say it.' }, 'conv3', 'mastered', 4, true),
  card({ id: 'm4', type: 'natural', category: 'Natural phrasing', es: 'Cuéntame más', said: 'Tell me more things', better: 'Tell me more', ipa: '/tɛl mi mɔːr/', why: 'Short and natural. No extra words needed.' }, 'conv4', 'mastered', 6),
  card({ id: 'm5', type: 'grammar', category: 'Verb tenses', es: 'Hace tres años que vivo aquí', said: 'I live here since three years', better: "I've lived here for three years", ipa: '/aɪv lɪvd hɪr fɔːr θriː jɪrz/', why: 'Use the present perfect with “for” + a length of time.' }, 'conv4', 'mastered', 6),
  card({ id: 'm6', type: 'natural', category: 'Natural phrasing', es: 'Me da igual', said: "It's the same for me", better: "I don't mind", ipa: '/aɪ doʊnt maɪnd/', why: '“I don’t mind” is what people say when they have no preference.' }, 'conv4', 'mastered', 6),
  card({ id: 'p1', type: 'grammar', category: 'Prepositions', es: 'Me interesa la música', said: "I'm interested on music", better: "I'm interested in music", ipa: '/aɪm ˈɪntrəstɪd ɪn ˈmjuːzɪk/', why: 'The preposition after “interested” is “in”.' }, 'conv4', 'mastered', 8),
  card({ id: 'p2', type: 'grammar', category: 'Prepositions', es: 'Ella es buena en matemáticas', said: "She's good in math", better: "She's good at math", ipa: '/ʃiz ɡʊd æt mæθ/', why: 'Use “good at” for skills.' }, 'conv4', 'mastered', 8),
  card({ id: 'p3', type: 'grammar', category: 'Prepositions', es: 'Llegué al aeropuerto', said: 'I arrived to the airport', better: 'I arrived at the airport', ipa: '/aɪ əˈraɪvd æt ði ˈɛrpɔːrt/', why: '“Arrive” takes “at” (or “in” for cities), not “to”.' }, 'conv4', 'mastered', 8),
  card({ id: 'p4', type: 'grammar', category: 'Prepositions', es: 'Le tengo miedo a las arañas', said: "I'm afraid from spiders", better: "I'm afraid of spiders", ipa: '/aɪm əˈfreɪd əv ˈspaɪdɚz/', why: 'After “afraid”, use “of”.' }, 'conv4', 'mastered', 8),
];

for (const session of conversations) {
  const found = cards.filter((c) => c.conversationId === session.id);
  session.grammarCount = found.filter((c) => c.type === 'grammar').length;
  session.naturalCount = found.filter((c) => c.type === 'natural').length;
}

export const reviews: Review[] = [];

/** mock-only: the Home streak and "This week" are fixed example data in the frontend too. */
export const mockStreakDays = 3;

export const mockWeek: WeekStats = {
  daysDone: [true, true, true, false, false, false, false],
  minutesPerDay: [14, 9, 19, 0, 0, 0, 0],
  conversations: 6,
};

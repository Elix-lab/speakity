import {
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import { Caveat_600SemiBold, Caveat_700Bold } from '@expo-google-fonts/caveat';
import {
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import type { TextStyle } from 'react-native';

import { colors } from './colors';

/**
 * Font files to load with `useFonts`. The object keys become the
 * fontFamily names on device, so `fonts` below refers to them by key.
 *
 * In React Native a custom font weight is a separate family, so never set
 * `fontWeight` together with these — pick the weighted family instead.
 */
export const fontAssets = {
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
  Caveat_600SemiBold,
  Caveat_700Bold,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
};

type FontName = keyof typeof fontAssets;

/** --display (Baloo 2): headers, buttons, big numbers */
/** --hand (Caveat): Monty's bubbles, handwritten subtitles */
/** --body (Nunito): body copy. Prototype body default weight is 500. */
export const fonts = {
  display: { 600: 'Baloo2_600SemiBold', 700: 'Baloo2_700Bold', 800: 'Baloo2_800ExtraBold' },
  hand: { 600: 'Caveat_600SemiBold', 700: 'Caveat_700Bold' },
  body: {
    500: 'Nunito_500Medium',
    600: 'Nunito_600SemiBold',
    700: 'Nunito_700Bold',
    800: 'Nunito_800ExtraBold',
  },
} as const satisfies Record<string, Record<number, FontName>>;

/** CSS `em` letter-spacing → RN px */
const em = (value: number, fontSize: number) => value * fontSize;

/**
 * Text styles, one per prototype selector. line-height in the CSS is a
 * multiplier; RN needs px, so it is computed from the font size.
 *
 * Baloo 2 (display) styles set NO lineHeight on purpose: Baloo has very tall
 * ascenders/descenders, and RN clips glyphs when lineHeight is smaller than
 * the font line box (CSS does not). The prototype tight values (1.05, 1,
 * 1.12) cut titles in half on device, so display text uses the font natural
 * line height. Adjust vertical rhythm with margins, never with lineHeight.
 */
export const textStyles = {
  // h1: 34px / 800 / 1.05, letter-spacing -.01em
  h1: {
    fontFamily: fonts.display[800],
    fontSize: 34,
    letterSpacing: em(-0.01, 34),
    color: colors.ink,
  },
  // h2: 22px / 800 / 1.05, letter-spacing -.01em
  h2: {
    fontFamily: fonts.display[800],
    fontSize: 22,
    letterSpacing: em(-0.01, 22),
    color: colors.ink,
  },
  // .sec (section heading): 22px / 700, letter-spacing -.01em
  section: {
    fontFamily: fonts.display[700],
    fontSize: 22,
    letterSpacing: em(-0.01, 22),
    color: colors.ink,
  },
  // .sub: 16px / 600, muted, line-height 1.4
  sub: {
    fontFamily: fonts.body[600],
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: colors.muted,
  },
  // .small: 13px / 600, muted
  small: {
    fontFamily: fonts.body[600],
    fontSize: 13,
    color: colors.muted,
  },
  // body default: Nunito 500
  body: {
    fontFamily: fonts.body[500],
    fontSize: 16,
    color: colors.ink,
  },
  // .stat b / .today-n: 28px / 700 display
  stat: {
    fontFamily: fonts.display[700],
    fontSize: 28,
    color: colors.ink,
  },
  // .pc-num: 44px / 600 / 1, letter-spacing -.02em
  hero: {
    fontFamily: fonts.display[600],
    fontSize: 44,
    letterSpacing: em(-0.02, 44),
    color: colors.ink,
  },
  // .quote (flashcard sentence): 30px / 700 / 1.12, letter-spacing -.01em
  quote: {
    fontFamily: fonts.display[700],
    fontSize: 30,
    letterSpacing: em(-0.01, 30),
    color: colors.ink,
  },
  // .bubble (Monty): Caveat 19px / 700, line-height 1.35
  bubble: {
    fontFamily: fonts.hand[700],
    fontSize: 19,
    lineHeight: 19 * 1.35,
    color: colors.ink,
  },
  // .btn: 17px / 700, letter-spacing -.005em
  button: {
    fontFamily: fonts.display[700],
    fontSize: 17,
    letterSpacing: em(-0.005, 17),
    color: colors.ink,
  },
  // .btn.big: 19px
  buttonBig: {
    fontFamily: fonts.display[700],
    fontSize: 19,
    letterSpacing: em(-0.005, 19),
    color: colors.ink,
  },
  // .pill: display 600 16px
  pill: {
    fontFamily: fonts.display[600],
    fontSize: 16,
    color: colors.ink,
  },
  // .chip: 13px / 700 (body font)
  chip: {
    fontFamily: fonts.body[700],
    fontSize: 13,
    color: colors.ink,
  },
  // .chips-sm .chip: 12px (padding 2px 8px)
  chipSm: {
    fontFamily: fonts.body[700],
    fontSize: 12,
    color: colors.ink,
  },
  // .logo: display 600 24px, letter-spacing -.02em
  logo: {
    fontFamily: fonts.display[600],
    fontSize: 24,
    letterSpacing: em(-0.02, 24),
    color: colors.ink,
  },
  // .today-t / .week-head b: display 18px / 700
  label: {
    fontFamily: fonts.display[700],
    fontSize: 18,
    color: colors.ink,
  },
  // .row b (list row title): display 18px / 700, letter-spacing -.005em
  rowTitle: {
    fontFamily: fonts.display[700],
    fontSize: 18,
    letterSpacing: em(-0.005, 18),
    color: colors.ink,
  },
  // .week-head span: 14px / 700, muted
  meta: {
    fontFamily: fonts.body[700],
    fontSize: 14,
    color: colors.muted,
  },
  // .day / .wbar span / .ring-num small: 12px / 700, muted
  caption: {
    fontFamily: fonts.body[700],
    fontSize: 12,
    color: colors.muted,
  },
  // .ring-num b: display 26px / 700
  ring: {
    fontFamily: fonts.display[700],
    fontSize: 26,
    color: colors.ink,
  },
  // .big-n: display 34px / 600, letter-spacing -.01em
  bigNumber: {
    fontFamily: fonts.display[600],
    fontSize: 34,
    letterSpacing: em(-0.01, 34),
    color: colors.ink,
  },
  // .tab: display 14px / 700
  tab: {
    fontFamily: fonts.display[700],
    fontSize: 14,
    color: colors.tabInactive,
  },
  // .tag: 11px / 700 (body font)
  tag: {
    fontFamily: fonts.body[700],
    fontSize: 11,
    color: colors.ink,
  },

  // ---- Talk ----
  // .status (Talk): display 24px / 700, letter-spacing -.005em
  status: {
    fontFamily: fonts.display[700],
    fontSize: 24,
    letterSpacing: em(-0.005, 24),
    textAlign: 'center',
    color: colors.ink,
  },
  // .timer: display 17px / 600, tabular-nums
  timer: {
    fontFamily: fonts.display[600],
    fontSize: 17,
    fontVariant: ['tabular-nums'],
    color: colors.ink,
  },
  // .text-toggle: display 16px / 600, underline
  link: {
    fontFamily: fonts.display[600],
    fontSize: 16,
    textDecorationLine: 'underline',
    color: colors.ink,
  },
  // .chat-bubble: 15px / 600, line-height 1.35
  chatBubble: {
    fontFamily: fonts.body[600],
    fontSize: 15,
    lineHeight: 15 * 1.35,
    color: colors.ink,
  },
  // .chat-empty: 14px / 600, muted
  chatEmpty: {
    fontFamily: fonts.body[600],
    fontSize: 14,
    textAlign: 'center',
    color: colors.muted,
  },
  // <b> inside .challenge-toggle: body 16px bold
  strong: {
    fontFamily: fonts.body[700],
    fontSize: 16,
    color: colors.ink,
  },

  // ---- Sentence card (.insight) ----
  // .insight .said: 16px / 600, muted
  said: {
    fontFamily: fonts.body[600],
    fontSize: 16,
    color: colors.muted,
  },
  // .insight .better: display 21px / 600, letter-spacing -.005em
  better: {
    fontFamily: fonts.display[600],
    fontSize: 21,
    letterSpacing: em(-0.005, 21),
    color: colors.ink,
  },
  // ---- Practice ----
  // .pr-head h1: h1 at 26px, on the ink header
  practiceTitle: {
    fontFamily: fonts.display[800],
    fontSize: 26,
    letterSpacing: em(-0.01, 26),
    color: colors.onDark,
  },
  // .pr-head p: 14px / 600, opacity .9
  practiceLede: {
    fontFamily: fonts.body[600],
    fontSize: 14,
    opacity: 0.9,
    color: colors.onDark,
  },
  // .pc-num-of: 22px inside .pc-num (display 600), muted
  heroOf: {
    fontFamily: fonts.display[600],
    fontSize: 22,
    color: colors.muted,
  },
  // .pc-sub: hand 19px / 600, muted
  hand: {
    fontFamily: fonts.hand[600],
    fontSize: 19,
    color: colors.muted,
  },
  // .legend: 14px / 600, muted (b inside: display 600, ink)
  legend: {
    fontFamily: fonts.body[600],
    fontSize: 14,
    color: colors.muted,
  },
  legendCount: {
    fontFamily: fonts.display[600],
    fontSize: 14,
    color: colors.ink,
  },
  // .focus-name: display 18px / 600
  focusName: {
    fontFamily: fonts.display[600],
    fontSize: 18,
    color: colors.ink,
  },
  // .see-all.quiet: display (from .see-all) 13px / 700, muted
  seeAllQuiet: {
    fontFamily: fonts.display[700],
    fontSize: 13,
    color: colors.muted,
  },
  // .win-line: 13px / 700, ok-x (= ink)
  winLine: {
    fontFamily: fonts.body[700],
    fontSize: 13,
    color: colors.ink,
  },
  // ---- All my sentences (library) ----
  // .status pill: 12px / 700. Display font: the Talk .status rule earlier in
  // the CSS sets font-family and this one only overrides size/weight.
  statusPill: {
    fontFamily: fonts.display[700],
    fontSize: 12,
    color: colors.ink,
  },
  // .fchip: display 13px / 700
  filterChip: {
    fontFamily: fonts.display[700],
    fontSize: 13,
    color: colors.ink,
  },
  // .date-range input: body 14px / 700
  dateInput: {
    fontFamily: fonts.body[700],
    fontSize: 14,
    color: colors.ink,
  },
  // .convo summary b: display 17px / 700, letter-spacing -.005em
  sentenceTitle: {
    fontFamily: fonts.display[700],
    fontSize: 17,
    letterSpacing: em(-0.005, 17),
    color: colors.ink,
  },
  // .album-hint: 14px / 600, muted, line-height 1.4, centered
  hint: {
    fontFamily: fonts.body[600],
    fontSize: 14,
    lineHeight: 14 * 1.4,
    textAlign: 'center',
    color: colors.muted,
  },
  // .count (review progress): display 16px / 600
  count: {
    fontFamily: fonts.display[600],
    fontSize: 16,
    textAlign: 'right',
    color: colors.ink,
  },
  // .pass-step: 13px / 700, muted (b inside: display 700, ink)
  passStep: {
    fontFamily: fonts.body[700],
    fontSize: 13,
    color: colors.muted,
  },
  passCount: {
    fontFamily: fonts.display[700],
    fontSize: 13,
    color: colors.ink,
  },
  // .face .lab: 15px / 700, muted
  faceLabel: {
    fontFamily: fonts.body[700],
    fontSize: 15,
    color: colors.muted,
  },
  // .ask-row .bubble: .bubble (hand 700, lh 1.35) at 15px
  bubbleSmall: {
    fontFamily: fonts.hand[700],
    fontSize: 15,
    lineHeight: 15 * 1.35,
    color: colors.ink,
  },
  // .first: 13px / 600, muted
  first: {
    fontFamily: fonts.body[600],
    fontSize: 13,
    color: colors.muted,
  },
  // .rate: display 16px / 600 · .rate small: body 12px / 700
  rate: {
    fontFamily: fonts.display[600],
    fontSize: 16,
    color: colors.ink,
  },
  rateInterval: {
    fontFamily: fonts.body[700],
    fontSize: 12,
    color: colors.ink,
  },

  // .ipa small: 12px / 700, opacity .7
  ipaLabel: {
    fontFamily: fonts.body[700],
    fontSize: 12,
    opacity: 0.7,
    color: colors.ink,
  },
  // .ipa span: 17px / 600, line-height 1.35. The prototype uses a system
  // font stack here ("Noto Sans","Segoe UI"…) for IPA glyph coverage, so
  // no custom family — the platform font has the IPA characters.
  ipa: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 17 * 1.35,
    color: colors.ink,
  },
  // .insight .why: 14px / 600, muted, line-height 1.4
  why: {
    fontFamily: fonts.body[600],
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: colors.muted,
  },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textStyles;

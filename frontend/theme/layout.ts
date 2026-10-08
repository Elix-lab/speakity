/**
 * Spacing, radii and borders — values from prototype.html.
 */
export const spacing = {
  screenX: 20, // .scroll: padding 0 20px 20px
  screenBottom: 20,
  topbarTop: 20, // .topbar: padding 20px 20px 8px, min-height 68px
  topbarBottom: 8,
  topbarMinHeight: 68,
  cardPadding: 20, // .card
  buttonPaddingX: 22, // .btn
  buttonGap: 10, // .btn gap (icon ↔ label)
} as const;

export const radii = {
  card: 22, // .card
  hero: 24, // .win-hero, .due-card, flashcard .face
  button: 18, // .btn
  rate: 16, // .rate
  insight: 16, // .insight
  full: 999, // pills, chips, tags, progress (99px in CSS)
} as const;

/** Border widths. Default is 2px ink everywhere; smaller elements go thinner. */
export const borders = {
  default: 2,
  chip: 1.5,
  tag: 1,
} as const;

export const sizes = {
  button: 56, // .btn height
  buttonBig: 60, // .btn.big height
  round: 44, // .round
  mic: 64, // .mic-btn
  micSmall: 40, // .mic-btn-sm
  progress: 14, // .progress height
  pin: 16, // .win-hero::before / .practice-card::before
} as const;

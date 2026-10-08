/**
 * "Sticker" pop shadow: a solid ink offset, no blur, no alpha.
 * RN's shadowRadius / elevation always blur, so this is drawn as a second
 * ink View behind the element (see components/ui/Sticker.tsx).
 */
export const pop = {
  sm: 2, // .pill, .round, .rate, .audio, .timer
  md: 4, // --pop: cards, secondary buttons
  lg: 6, // --pop-lg: primary button, mic, challenge sheet
} as const;

export type PopSize = keyof typeof pop;

/** Hand-placed rotations (deg). */
export const tilt = {
  left: -0.6, // .due-card, .review-card, .stat, .win-hero
  right: 0.5, // .practice-card
} as const;

export type Tilt = keyof typeof tilt;

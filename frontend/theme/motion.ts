/**
 * Animation timings from prototype.html. Use these, don't invent new ones.
 * Bezier tuples are the cubic-bezier() args, for Easing.bezier(...).
 */
export const motion = {
  // :active press on stickers — transition: transform .08s, box-shadow .08s
  press: { duration: 80 },
  // .progress i — width .45s cubic-bezier(.3,1.3,.5,1)
  progress: { duration: 450, bezier: [0.3, 1.3, 0.5, 1] },
  // .enter — .35s cubic-bezier(.2,.9,.3,1), translateY 10 → 0
  enter: { duration: 350, bezier: [0.2, 0.9, 0.3, 1], fromY: 10 },
  // .streak.pop — .6s cubic-bezier(.3,1.6,.5,1), scale 1 → 1.3 → 1
  pop: { duration: 600, bezier: [0.3, 1.6, 0.5, 1] },
  // flashcard flip — .6s cubic-bezier(.3,1.15,.4,1)
  flip: { duration: 600, bezier: [0.3, 1.15, 0.4, 1] },
  // .think-dots — 1.3s ease-in-out, stagger .18s
  thinkDot: { duration: 1300, stagger: 180, liftY: -5, minOpacity: 0.3 },
  // mascot idle loop (.due-card .mia, .pc-mia) — 3.4s ease-in-out
  idle: { duration: 3400 },
  // confetti — 2.6s ease-in
  confetti: { duration: 2600 },
} as const;

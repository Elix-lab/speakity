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
  // .think-dots — 1.3s ease-in-out, stagger .18s.
  // keyframes 0/80/100%: opacity .3, y 0 · 40%: opacity 1, y -5px
  thinkDot: { duration: 1300, stagger: 180, liftY: -5, minOpacity: 0.3 },
  // CSS `ease-in-out` keyword = cubic-bezier(.42,0,.58,1)
  easeInOut: [0.42, 0, 0.58, 1],
  easeIn: [0.42, 0, 1, 1], // CSS `ease-in`
  easeOut: [0, 0, 0.58, 1], // CSS `ease-out`
  // .bar (waveform) — 21 bars, height 7px ↔ --h, ease-in-out infinite.
  // Per bar the prototype randomizes --h 10–40px, --d .55–1.25s and a
  // negative delay 0–1s (starts mid-cycle).
  bar: { count: 21, restHeight: 7, minPeak: 10, peakRange: 30, minDur: 550, durRange: 700, maxPhase: 1000 },
  // swapPose(): current pose stretches, squashes, then the new pose
  // starts squashed and springs back. transform-origin 50% 100%.
  poseSwap: {
    stretch: { scaleX: 0.95, scaleY: 1.06, duration: 90 }, // ease-out
    squash: { scaleX: 1.08, scaleY: 0.93, duration: 90 }, // ease-in
    settle: { duration: 140, bezier: [0.3, 1.3, 0.6, 1] },
  },
  // .mic-btn — transition opacity .2s; .mia-mini — opacity .3s
  micFade: { duration: 200 },
  miniFade: { duration: 300 },
  // mascot idle loop (.due-card .mia, .pc-mia) — 3.4s ease-in-out
  idle: { duration: 3400 },
  // confetti — 2.6s ease-in
  confetti: { duration: 2600 },
} as const;

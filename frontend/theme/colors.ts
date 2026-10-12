/**
 * Color tokens — copied 1:1 from the `:root` block of
 * design-reference/prototype.html. Do not eyeball new values; if something
 * is missing, find the selector in the prototype and copy it here.
 *
 * Every `-d` / `-x` variant in the prototype is ink (#17191B): text on any
 * tint uses ink, never white. They are not repeated here — use `ink`.
 */
export const colors = {
  ink: '#17191B', // main text, borders, sticker shadows
  muted: '#66705F', // secondary text
  surface: '#FFFFFF', // card background
  bg: '#FFF7DF', // screen background (warm paper)

  // Hero green — THE primary action
  leaf: '#3FD12B',
  leafTint: '#DFF6D0',
  // Neutral warm tag
  shell: '#F3E8C9',
  shellTint: '#F3E8C9',
  // Warm yellow — streak, achievements, "nice!"
  sun: '#FFC400',
  sunTint: '#FFF0C2',
  // Red — grammar errors / "needs work"
  coral: '#FF4458',
  coralTint: '#FFE0E4',
  // Sky blue — "more natural" + info
  sea: '#1E9BEB',
  seaTint: '#DCEEFB',
  // Emerald — mastered / progress
  ok: '#10B374',
  okTint: '#D3F3E5',
  // Warm stone — "new" card state
  new: '#DED0A3',
  newTint: '#F3E8C9',

  onDark: '#FFF7DF', // text on the ink practice header (.pr-head)
  white: '#FFFFFF', // e.g. text on .badge / .day.done

  // One-off state colors, straight from the prototype CSS
  disabledBg: '#E7EEE9', // .btn:disabled background
  disabledInk: '#8FA095', // .btn:disabled text + border
  micDisabled: '#D7CDA6', // .mic-btn while speaking/thinking/muted
  tabInactive: '#A39B85', // .tab (inactive)
  ringTrack: 'rgba(27,27,27,.12)', // Home "Today" ring track
  // Not in the prototype (it has no modals): backdrop behind the iOS date sheet, ink at 35%
  scrim: 'rgba(23,25,27,.35)',
} as const;

export type ColorToken = keyof typeof colors;

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Monday-first weekday initials, as in the prototype's week strip. */
export const WEEK_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

/** Index of today in a Monday-first week (0 = Monday). */
export function todayWeekIndex(now = new Date()): number {
  return (now.getDay() + 6) % 7;
}

/** "Today", "Yesterday", "Monday", "Last week", "2 weeks ago"… */
export function relativeDay(iso: string, now = new Date()): string {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const date = new Date(iso);
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return WEEKDAYS[date.getDay()];
  if (days < 14) return 'Last week';
  return `${Math.floor(days / 7)} weeks ago`;
}

// ---- Calendar days as YYYY-MM-DD in the device's time zone ----

const pad = (n: number) => String(n).padStart(2, '0');

/** Date → "2026-10-04" (local day, not UTC). */
export function toLocalDay(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "2026-10-04" → Date at local midnight. */
export function fromLocalDay(day: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "2026-10-04" → "Oct 4, 2026" */
export function formatDay(day: string): string {
  return fromLocalDay(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** ISO date → "Monday, Oct 12" — the title of a day's conversation. */
export function conversationDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

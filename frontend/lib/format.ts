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

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Date → "2026-10-04" in the given time zone. Days (daily caps, Recent
 * conversations, Library filters) are the user's calendar days, not UTC.
 * Without a zone it uses the server's, as the mock endpoints do for now.
 */
export function toLocalDay(date: Date, timeZone?: string): string {
  if (!timeZone) return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export const isLocalDay = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export function daysFromNow(n: number, now = new Date()): Date {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return d;
}

export function endOfDay(now: Date): Date {
  const d = new Date(now);
  d.setHours(23, 59, 59, 999);
  return d;
}

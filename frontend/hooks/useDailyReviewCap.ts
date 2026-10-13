import { updateSettings } from '@/lib/api';
import { useSettingsStore, type DailyReviewCap } from '@/store/useSettingsStore';
import { useTodayStore } from '@/store/useTodayStore';

/**
 * The user's daily review cap (10/15/20/25) and a way to change it. Saving
 * refreshes today's summary, so Practice's "Review N" and Home update at once.
 */
export function useDailyReviewCap() {
  const cap = useSettingsStore((s) => s.dailyReviewCap);
  const setCap = useSettingsStore((s) => s.setDailyReviewCap);
  const loadToday = useTodayStore((s) => s.loadToday);

  const save = async (next: DailyReviewCap) => {
    await updateSettings({ dailyReviewCap: next });
    setCap(next);
    await loadToday();
  };

  return { cap, save };
}

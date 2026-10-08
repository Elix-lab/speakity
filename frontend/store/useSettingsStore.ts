import { create } from 'zustand';

/** Fixed, not user-configurable (see CLAUDE.md rule 4). */
export const NEW_CARDS_PER_DAY = 5;

export const DAILY_REVIEW_CAP_OPTIONS = [10, 15, 20, 25] as const;
export type DailyReviewCap = (typeof DAILY_REVIEW_CAP_OPTIONS)[number];

type SettingsState = {
  dailyReviewCap: DailyReviewCap;
  setDailyReviewCap: (cap: DailyReviewCap) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  dailyReviewCap: 15,
  setDailyReviewCap: (dailyReviewCap) => set({ dailyReviewCap }),
}));

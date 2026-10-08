import { create } from 'zustand';

import { getTodaySummary } from '@/lib/api';
import type { TodaySummary } from '@/lib/types';

/**
 * Today's summary is shared across screens (Home card, streak pill, the
 * Practice tab's due-count badge), so it lives in global state.
 */
type TodayState = {
  today: TodaySummary | null;
  loadToday: () => Promise<void>;
};

export const useTodayStore = create<TodayState>((set) => ({
  today: null,
  loadToday: async () => set({ today: await getTodaySummary() }),
}));

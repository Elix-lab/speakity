import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getPracticeOverview } from '@/lib/api';
import type { PracticeOverview } from '@/lib/types';
import { useTodayStore } from '@/store/useTodayStore';

/**
 * Everything the Practice tab needs. Reloaded every time the tab gains
 * focus, so it's fresh after a review session. Fields are null while loading.
 */
export function usePracticeData() {
  const today = useTodayStore((s) => s.today);
  const loadToday = useTodayStore((s) => s.loadToday);
  const [overview, setOverview] = useState<PracticeOverview | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadToday();
      getPracticeOverview().then((o) => active && setOverview(o));
      return () => {
        active = false;
      };
    }, [loadToday]),
  );

  return { today, overview };
}

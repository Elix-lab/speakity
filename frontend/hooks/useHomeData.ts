import { useEffect, useState } from 'react';

import { getRecentConversations, getWeekStats } from '@/lib/api';
import type { ConversationSummary, WeekStats } from '@/lib/types';
import { useTodayStore } from '@/store/useTodayStore';

/** Everything the Home screen needs. Each field is null while loading. */
export function useHomeData() {
  const today = useTodayStore((s) => s.today);
  const loadToday = useTodayStore((s) => s.loadToday);
  const [week, setWeek] = useState<WeekStats | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null);

  useEffect(() => {
    let active = true;
    loadToday();
    getWeekStats().then((w) => active && setWeek(w));
    getRecentConversations(3).then((c) => active && setConversations(c));
    return () => {
      active = false;
    };
  }, [loadToday]);

  return { today, week, conversations };
}

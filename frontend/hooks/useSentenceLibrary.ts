import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';

import { getSentences } from '@/lib/api';
import type { CardStatus, SentencePage, SentenceQuery } from '@/lib/types';

const SPEECH_OPTIONS = { language: 'en-US', rate: 0.92 };

const ALL_STATUSES: CardStatus[] = ['new', 'learning', 'mastered'];

/**
 * "All my sentences": filters, paging and the current page. Every filter
 * change goes back to page 1, as in the prototype. The page stays null
 * only on the first load; later loads keep showing the previous page.
 */
export function useSentenceLibrary() {
  const [query, setQuery] = useState<SentenceQuery>({ statuses: ALL_STATUSES, from: null, to: null, page: 1 });
  const [result, setResult] = useState<SentencePage | null>(null);

  useEffect(() => {
    let active = true;
    getSentences(query).then((r) => active && setResult(r));
    return () => {
      active = false;
    };
  }, [query]);

  useEffect(
    () => () => {
      Speech.stop();
    },
    [],
  );

  return {
    query,
    result,
    toggleStatus: (status: CardStatus) =>
      setQuery((q) => ({
        ...q,
        page: 1,
        statuses: q.statuses.includes(status) ? q.statuses.filter((s) => s !== status) : [...q.statuses, status],
      })),
    setDates: ({ from, to }: { from: string | null; to: string | null }) =>
      setQuery((q) => ({ ...q, from, to, page: 1 })),
    setPage: (page: number) => setQuery((q) => ({ ...q, page })),
    listen: (text: string) => {
      Speech.stop();
      Speech.speak(text, SPEECH_OPTIONS);
    },
  };
}

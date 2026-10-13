import type { Request, Response } from 'express';
import { cards } from '../db/mockStore.js';
import type { CardStats, FocusArea, PracticeOverview } from '../types/api.js';
import { todaysReviews } from './reviewQueue.js';
import { currentUser, toFlashcard } from './shared.js';

/** GET /practice — progress, focus areas and recent wins for the Practice tab. */
export async function getOverview(req: Request, res: Response) {
  const user = currentUser(req);
  const userCards = cards.filter((c) => c.userId === user.id);

  const stats: CardStats = { new: 0, learning: 0, mastered: 0 };
  const byCategory = new Map<string, FocusArea>();
  for (const c of userCards) {
    stats[c.status]++;
    const area = byCategory.get(c.category) ?? { category: c.category, total: 0, new: 0, learning: 0, mastered: 0 };
    area.total++;
    area[c.status]++;
    byCategory.set(c.category, area);
  }
  // most still-to-learn first, then the biggest category
  const focusAreas = [...byCategory.values()].sort(
    (a, b) => b.total - b.mastered - (a.total - a.mastered) || b.total - a.total,
  );

  const masteredTodayIds = new Set(
    todaysReviews(user)
      .filter((r) => r.settled && r.statusAfter === 'mastered')
      .map((r) => r.cardId),
  );
  const overview: PracticeOverview = {
    stats,
    focusAreas,
    corrected: userCards.filter((c) => c.win && !masteredTodayIds.has(c.id)).slice(0, 3).map(toFlashcard),
    masteredToday: userCards.filter((c) => masteredTodayIds.has(c.id)).slice(0, 3).map(toFlashcard),
  };
  res.json(overview);
}

import { fromNodeHeaders } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';
import { auth } from '../config/auth.js';
import { MOCK_USER_ID } from '../db/mockStore.js';
import { HttpError } from './errorHandler.js';

/** Rejects requests without a BetterAuth session; sets req.userId. */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const current = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!current) throw new HttpError(401, 'Not signed in');
  req.userId = current.user.id;
  next();
}

/**
 * mock-only: every request acts as the example user, until the app has
 * login screens. Swap for `requireAuth` in routes/index.ts.
 */
export function mockUser(req: Request, _res: Response, next: NextFunction) {
  req.userId = MOCK_USER_ID;
  next();
}

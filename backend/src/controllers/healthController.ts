import type { Request, Response } from 'express';
import { pingDb } from '../db/index.js';

/** GET /health — the server is up; `db` says whether Supabase answers. */
export async function check(_req: Request, res: Response) {
  res.json({ status: 'ok', db: await pingDb(), uptimeSec: Math.round(process.uptime()) });
}

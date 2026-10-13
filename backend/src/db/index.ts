import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env.js';
import * as schema from '../models/index.js';

if (!env.databaseUrl) {
  console.warn('[db] DATABASE_URL is not set: auth and anything that queries the database will fail.');
}

// prepare: false — Supabase's pooler (transaction mode) doesn't support prepared statements.
// Postgres connects lazily, so the server starts without a database.
const client = postgres(env.databaseUrl ?? 'postgres://localhost:5432/postgres', { prepare: false });

export const db = drizzle(client, { schema, casing: 'snake_case' });

/** For the health check: is the database reachable? */
export async function pingDb(): Promise<'up' | 'down' | 'not_configured'> {
  if (!env.databaseUrl) return 'not_configured';
  try {
    await db.execute(sql`select 1`);
    return 'up';
  } catch {
    return 'down';
  }
}

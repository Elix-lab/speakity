import { defineConfig } from 'drizzle-kit';

// drizzle-kit doesn't read .env on its own
try {
  process.loadEnvFile();
} catch {
  // no .env: use the shell's environment
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models/index.ts',
  out: './src/db/migrations',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
  casing: 'snake_case',
});

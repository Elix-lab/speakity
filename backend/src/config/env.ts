/**
 * Environment variables, read once. In development the server starts
 * without a database so the mock endpoints can be tried right away.
 */

const isProduction = process.env.NODE_ENV === 'production';

function read(name: string, { requiredInProduction = false } = {}): string | undefined {
  const value = process.env[name]?.trim() || undefined;
  if (!value && requiredInProduction && isProduction) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

const port = Number(read('PORT') ?? 3000);

export const env = {
  isProduction,
  port,
  databaseUrl: read('DATABASE_URL', { requiredInProduction: true }),
  betterAuthSecret: read('BETTER_AUTH_SECRET', { requiredInProduction: true }),
  betterAuthUrl: read('BETTER_AUTH_URL') ?? `http://localhost:${port}`,
  corsOrigins: (read('CORS_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  openaiApiKey: read('OPENAI_API_KEY'),
};

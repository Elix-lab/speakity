import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import { auth } from './config/auth.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { routes } from './routes/index.js';

export const app = express();

app.use(
  cors({
    // No list in development → reflect any origin (Expo web on whatever port).
    origin: env.corsOrigins.length ? env.corsOrigins : !env.isProduction,
    credentials: true,
  }),
);

// BetterAuth reads the raw body itself: mount it before express.json().
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());
app.use(routes);
app.use(notFound);
app.use(errorHandler);

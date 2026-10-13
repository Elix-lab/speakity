import { Router } from 'express';
import { mockUser } from '../middleware/auth.js';
import { cardRoutes } from './cards.js';
import { conversationRoutes } from './conversations.js';
import { healthRoutes } from './health.js';
import { meRoutes } from './me.js';
import { practiceRoutes } from './practice.js';

export const routes = Router();

routes.use('/health', healthRoutes);

// mock-only: no login screens yet, every request is the example user.
// Swap `mockUser` for `requireAuth` (middleware/auth.ts) once there are.
routes.use(mockUser);
routes.use('/me', meRoutes);
routes.use('/practice', practiceRoutes);
routes.use('/cards', cardRoutes);
routes.use('/conversations', conversationRoutes);

import { Router } from 'express';
import * as me from '../controllers/meController.js';

export const meRoutes = Router();

meRoutes.get('/today', me.getToday);
meRoutes.get('/week', me.getWeek);
meRoutes.get('/settings', me.getSettings);
meRoutes.patch('/settings', me.updateSettings);

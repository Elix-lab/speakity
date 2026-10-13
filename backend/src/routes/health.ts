import { Router } from 'express';
import * as health from '../controllers/healthController.js';

export const healthRoutes = Router();

healthRoutes.get('/', health.check);

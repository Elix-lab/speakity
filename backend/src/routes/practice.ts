import { Router } from 'express';
import * as practice from '../controllers/practiceController.js';

export const practiceRoutes = Router();

practiceRoutes.get('/', practice.getOverview);

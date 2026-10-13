import { Router } from 'express';
import * as cards from '../controllers/cardController.js';

export const cardRoutes = Router();

cardRoutes.get('/', cards.list);
cardRoutes.get('/due', cards.getDue);
cardRoutes.get('/challenge', cards.getChallenge);
cardRoutes.post('/:id/review', cards.review);

import { Router } from 'express';
import multer from 'multer';
import * as conversations from '../controllers/conversationController.js';

// Recorded turns arrive as multipart; kept in memory and passed on to STT.
const audioUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

export const conversationRoutes = Router();

conversationRoutes.get('/', conversations.list);
conversationRoutes.post('/', conversations.start);
conversationRoutes.get('/:id', conversations.get);
conversationRoutes.post('/:id/transcribe', audioUpload.single('audio'), conversations.transcribeTurn);
conversationRoutes.post('/:id/reply', conversations.reply);
conversationRoutes.post('/:id/end', conversations.end);
conversationRoutes.get('/:id/recap', conversations.getRecap);

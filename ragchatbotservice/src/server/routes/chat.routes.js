/**
 * -----------------------------------------------------------------------------
 * File: src/server/routes/chat.routes.js
 *
 * Mounts the chat endpoint — POST /api/chat.
 *
 * Responsibilities:
 * - Apply chat validation rules before routing.
 * - Forward validated requests to the chat controller.
 * -----------------------------------------------------------------------------
 */

import { Router } from 'express';
import chatController from '../controllers/chat.controller.js';
import { chatValidationRules } from '../validators/chat.validator.js';
import validationMiddleware from '../middleware/validation.middleware.js';

const router = Router();

router.post(
  '/',
  chatValidationRules,
  validationMiddleware,
  chatController.ragChat,
);
router.post('/test', chatController.chatTest);

export default router;
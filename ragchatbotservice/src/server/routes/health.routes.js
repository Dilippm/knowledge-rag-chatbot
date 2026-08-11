/**
 * -----------------------------------------------------------------------------
 * File: src/server/routes/health.routes.js
 *
 * Exposes a health-check endpoint — GET /api/health.
 *
 * Responsibilities:
 * - Return the current application health status.
 * -----------------------------------------------------------------------------
 */

import { Router } from 'express';
import healthController from '../controllers/health.controller.js';

const router = Router();

router.get('/', healthController.health);

export default router;
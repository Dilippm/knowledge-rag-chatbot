/**
 * -----------------------------------------------------------------------------
 * File: src/server/routes/index.routes.js
 *
 * Top-level router — aggregates all route modules under
 * their respective path prefixes.
 *
 * Responsibilities:
 * - Mount health, chat, and ingestion routes.
 * -----------------------------------------------------------------------------
 */

import { Router } from 'express';
import chatRoutes from './chat.routes.js';
import healthRoutes from './health.routes.js';
import ingestionRoutes from './ingestion.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/chat', chatRoutes);
router.use('/ingestion', ingestionRoutes);

export default router;
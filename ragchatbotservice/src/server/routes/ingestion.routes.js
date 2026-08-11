/**
 * -----------------------------------------------------------------------------
 * File: src/server/routes/ingestion.routes.js
 *
 * Mounts the ingestion endpoint — POST /api/ingestion.
 *
 * Responsibilities:
 * - Apply ingestion validation rules before routing.
 * - Forward validated requests to the ingestion controller.
 * -----------------------------------------------------------------------------
 */

import { Router } from 'express';
import ingestionController from '../controllers/ingestion.controller.js';
import validationMiddleware from '../middleware/validation.middleware.js';
import { ingestionValidationRules } from '../validators/ingestion.validator.js';

const router = Router();

router.post(
  '/',
  ingestionValidationRules,
  validationMiddleware,
  ingestionController.ingestProjectDocuments,
);

export default router;
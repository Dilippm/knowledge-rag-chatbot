/**
 * -----------------------------------------------------------------------------
 * File: src/server/validators/ingestion.validator.js
 *
 * Express-validator rule set for the document-ingestion
 * endpoint.
 *
 * Responsibilities:
 * - Validate the `projectName` field in ingestion requests.
 * -----------------------------------------------------------------------------
 */

import { body } from 'express-validator';

/**
 * Validation rules for ingestion requests.
 *
 * Ensures projectName is present and is a non-empty string.
 */
export const ingestionValidationRules = [
  body('projectName')
    .exists()
    .withMessage('Project name is required.')
    .bail()
    .isString()
    .withMessage('Project name must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty.'),
];
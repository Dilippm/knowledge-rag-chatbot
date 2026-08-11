/**
 * -----------------------------------------------------------------------------
 * File: src/server/middleware/index.js
 *
 * Barrel file — aggregates all middleware exports.
 *
 * Responsibilities:
 * - Provide a single import point for middleware consumers.
 * -----------------------------------------------------------------------------
 */

import notFoundMiddleware from './not-found.middleware.js';
import errorMiddleware from './error.middleware.js';
import authMiddlewares from './auth.middleware.js';

export default {
    notFoundMiddleware,
    errorMiddleware,
    authMiddlewares,
};
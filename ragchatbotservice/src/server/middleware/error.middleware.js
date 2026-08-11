/**
 * -----------------------------------------------------------------------------
 * File: src/server/middleware/error.middleware.js
 *
 * Global Express error handler — catches unhandled errors
 * thrown from route handlers and validators.
 *
 * Responsibilities:
 * - Log error details (stack, method, url, timestamp).
 * - Return a consistent JSON error response.
 * -----------------------------------------------------------------------------
 */

import logger from '../../config/logger.config.js';

/**
 * Catches errors propagated via `next(err)` and sends a
 * standardised JSON response. Extracts the status code from
 * `err.statusCode` or defaults to 500.
 *
 * @param {Error} err - The caught error.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const errorMiddleware = (err, req, res) => {
  logger.error(`${err.message}:`, {
    stack: err.stack,
    method: req.method,
    url: req.url,
    time: new Date().toISOString(),
  });
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export default errorMiddleware;
/**
 * -----------------------------------------------------------------------------
 * File: src/server/middleware/validation.middleware.js
 *
 * Express-validator middleware — runs after the route-level
 * validation rules and forwards errors to the error handler.
 *
 * Responsibilities:
 * - Collect validation errors from express-validator.
 * - Build an error with status 400 and pass it to next().
 * -----------------------------------------------------------------------------
 */

import { validationResult } from 'express-validator';

/**
 * Processes validation results from express-validator.
 *
 * If errors are present, it creates an `Error` with status 400
 * and forwards it via `next()` to the global error middleware.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      `Validation Failed:${errors.array().map((err) => err.msg)[0]}`,
    );
    error.statusCode = 400;
    return next(error);
  }

  next();
};

export default validationMiddleware;
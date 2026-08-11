/**
 * -----------------------------------------------------------------------------
 * File: src/server/middleware/not-found.middleware.js
 *
 * Catch-all middleware for unmatched routes.
 *
 * Responsibilities:
 * - Respond with a 404 and a descriptive message
 *   when no other route matched the request.
 * -----------------------------------------------------------------------------
 */

/**
 * Returns a 404 JSON response for any path that does not
 * match a registered route.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found.`,
  });
};

export default notFoundMiddleware;
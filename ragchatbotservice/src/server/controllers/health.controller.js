/**
 * -----------------------------------------------------------------------------
 * File: src/server/controllers/health.controller.js
 *
 * Health-check endpoint — returns a simple status
 * response indicating the server is running.
 *
 * Responsibilities:
 * - Respond with 200 and a success message.
 * -----------------------------------------------------------------------------
 */

/**
 * Returns the current server health status.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const health = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running.',
  });
};

export default {
  health,
};
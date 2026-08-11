/**
 * -----------------------------------------------------------------------------
 * File: src/server/controllers/ingestion.controller.js
 *
 * Initiates document ingestion for a project.
 *
 * Responsibilities:
 * - Validate the projectName parameter.
 * - Kick off the document-processing pipeline.
 * - Return an immediate 202-accepted response.
 * -----------------------------------------------------------------------------
 */

import { startDocumentProcessing } from '../jobs/documentprocessing/documentProcessing.job.js';

/**
 * Accepts an ingestion request and starts the
 * document-processing pipeline for the given project.
 *
 * Returns immediately with 202; the actual work runs
 * asynchronously in the background.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const ingestProjectDocuments = async (req, res, next) => {
  try {
    const { projectName } = req.body;

    if (!projectName) {
      throw new Error('Project name is required.');
    }

    startDocumentProcessing(projectName);

    return res.status(202).json({
      success: true,
      message: 'Document processing started.',
    });
  } catch (err) {
    next(err);
  }
};

export default {
  ingestProjectDocuments,
};
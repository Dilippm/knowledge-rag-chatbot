/**
 * -----------------------------------------------------------------------------
 * File: src/server/jobs/documentprocessing/documentProcessing.job.js
 *
 * Top-level orchestrator for the document-processing pipeline.
 *
 * Responsibilities:
 * - Run ingestion, embedding, and indexing stages in sequence.
 * - Clean up generated files after processing completes.
 * -----------------------------------------------------------------------------
 */

import logger from '../../../config/logger.config.js';

import { cleanupGeneratedFiles } from '../../cleanup/cleanup.service.js';

import { runIngestionJob } from './ingestion.job.js';
import { runEmbeddingJob } from './embedding.job.js';
import { runIndexingJob } from './indexing.job.js';

/**
 * Executes the full document-processing pipeline for a given
 * project: ingest files, generate embeddings, index into the
 * vector store, then clean up temporary files.
 *
 * @param {string} projectName - Name of the project to process.
 * @returns {Promise<void>}
 */
export const startDocumentProcessing = async (projectName) => {
  try {
    logger.info('========== DOCUMENT PROCESSING STARTED ==========');

    await runIngestionJob(projectName);

    await runEmbeddingJob();

    const result = await runIndexingJob();

    await cleanupGeneratedFiles();

    console.log('Cleanup completed');

    logger.info(
      `DOCUMENT PROCESSING COMPLETED (${result.total} documents indexed)`,
    );
  } catch (err) {
    logger.error('Document processing failed');
    logger.error(err.stack);
  }
};
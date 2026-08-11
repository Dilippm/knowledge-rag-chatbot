/**
 * -----------------------------------------------------------------------------
 * File: src/server/jobs/documentprocessing/indexing.job.js
 *
 * Orchestrator for the vector-store indexing stage of the
 * document-processing pipeline.
 *
 * Responsibilities:
 * - Index documents into the vector store and return
 *   the count of indexed documents.
 * -----------------------------------------------------------------------------
 */

import logger from '../../../config/logger.config.js';

import { indexDocuments } from '../../../rag/services/vectorstore/indexing.service.js';

/**
 * Indexes documents into the vector store and returns the
 * indexing result (total count).
 *
 * @returns {Promise<{ total: number }>} Indexing result summary.
 */
export const runIndexingJob = async () => {
  logger.info('========== INDEXING STARTED ==========');

  const result = await indexDocuments();

  logger.info(`${result.total} documents indexed and Indexing completed`);

  return result;
};
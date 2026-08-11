/**
 * -----------------------------------------------------------------------------
 * File: src/server/jobs/documentprocessing/embedding.job.js
 *
 * Orchestrator for the embedding-generation stage of the
 * document-processing pipeline.
 *
 * Responsibilities:
 * - Run the embedding pipeline and log the result count.
 * -----------------------------------------------------------------------------
 */

import logger from '../../../config/logger.config.js';
import { runEmbeddingPipeline } from '../../../rag/services/embeddings/embedding.runner.js';

/**
 * Generates embeddings for all ingested documents by
 * delegating to the embedding runner service.
 *
 * @returns {Promise<void>}
 */
export const runEmbeddingJob = async () => {
  logger.info('========== EMBEDDING STARTED ==========');

  const documents = await runEmbeddingPipeline();

  logger.info(
    `${documents.length} embeddings generated and Embedding completed`,
  );
};
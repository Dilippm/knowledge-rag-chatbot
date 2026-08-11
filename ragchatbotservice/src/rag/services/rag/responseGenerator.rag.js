/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/rag/responseGenerator.rag.js
 *
 * Invokes the RAG chain and assembles the final
 * response object with source metadata and timing.
 *
 * Responsibilities:
 * - Run the RAG chain with the user's question.
 * - Format source metadata.
 * - Attach response-time metrics.
 * -----------------------------------------------------------------------------
 */

import { ragChain } from '../../chains/rag.chain.js';
import logger from '../../../config/logger.config.js';
import { formatSources } from './sourceFormatter.service.js';

export const generateResponse = async (input) => {
  const startTime = Date.now();

  try {
    logger.info('Generating AI response...');

    const result = await ragChain.invoke(input);

    return {
      answer: result.answer,
      confidence: result.confidence,
      sources: formatSources(result.sources),
      metadata: {
        responseTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    throw new Error(error);
  }
};
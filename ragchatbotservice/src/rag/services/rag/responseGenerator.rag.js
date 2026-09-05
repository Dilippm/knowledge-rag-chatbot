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
import { CallbackHandler } from '@langfuse/langchain';
import { appConfig } from '../../../config/app.config.js';
export const generateResponse = async (input) => {
  const startTime = Date.now();

  try {
    logger.info('Generating AI response...');
const langfuseHandler = new CallbackHandler({
  publicKey: appConfig.langfuse.publicKey,
  secretKey: appConfig.langfuse.secretKey,
  baseUrl: appConfig.langfuse.baseUrl,
});
   // const result = await ragChain.invoke(input);
const result = await ragChain.invoke(input, {
  callbacks: [langfuseHandler],
});
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
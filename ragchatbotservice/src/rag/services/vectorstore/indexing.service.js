/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/vectorstore/indexing.service.js
 *
 * Indexes all embedded documents into the configured
 * vector store.
 *
 * Responsibilities:
 * - Load embeddings, then upsert them via the provider.
 * -----------------------------------------------------------------------------
 */

import logger from '../../../config/logger.config.js';
import { loadEmbeddings } from '../embeddings/embedding.utils.js';
import { getVectorStoreProvider } from './vectorstore.factory.js';

/**
 * Index all embedded documents into the configured vector store.
 */
export async function indexDocuments() {
  const documents = await loadEmbeddings();

  if (!documents.length) {
    logger.info('No embeddings found.');

    return {
      indexed: 0,
      total: 0,
    };
  }

  const provider = await getVectorStoreProvider();

  const result = await provider.upsert(documents);

  return {
    total: documents.length,
    ...result,
  };
}
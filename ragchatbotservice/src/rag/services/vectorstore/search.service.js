/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/vectorstore/search.service.js
 *
 * Performs a semantic similarity search against the
 * configured vector store.
 *
 * Responsibilities:
 * - Generate an embedding for the query.
 * - Delegate to the provider's similaritySearch.
 * -----------------------------------------------------------------------------
 */

import { generateEmbedding } from '../embeddings/embedding.service.js';
import { getVectorStoreProvider } from './vectorstore.factory.js';

/**
 * Search for semantically similar documents.
 *
 * @param {string} query
 * @param {Object} options
 * @param {number} options.limit
 *
 * @returns {Promise<Array>}
 */
export async function searchDocuments(query, { limit = 5 } = {}) {
  if (!query?.trim()) {
    throw new Error('Search query is required.');
  }

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Get the configured provider
  const provider = await getVectorStoreProvider();

  // Perform similarity search
  return provider.similaritySearch(queryEmbedding, { limit });
}
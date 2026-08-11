/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/vectorstore/vectorstore.contract.js
 *
 * Defines the expected interface for all vector-store
 * adapters.
 *
 * Responsibilities:
 * - Validate that a provider implements the required
 *   methods (initialize, upsert, similaritySearch, etc.).
 * -----------------------------------------------------------------------------
 */

/**
 * Vector Store Contract
 *
 * Every vector store adapter must implement the following functions:
 *
 * initialize()
 * upsert(documents)
 * similaritySearch(queryEmbedding, options)
 * delete(ids)
 * count()
 * close()
 */

export const requiredMethods = [
  'initialize',
  'upsert',
  'similaritySearch',

  'count',
  'close',
];

export function validateVectorStore(adapter) {
  for (const method of requiredMethods) {
    if (typeof adapter[method] !== 'function') {
      throw new Error(
        `Vector store provider is missing required method: ${method}`,
      );
    }
  }

  return true;
}
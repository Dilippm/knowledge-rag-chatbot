/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/retriever/vectostore.retriever.js
 *
 * Creates a LangChain retriever from the configured
 * vector store.
 *
 * Responsibilities:
 * - Wrap the vector store as a retriever with default
 *   top-K (5) and configurable options.
 * -----------------------------------------------------------------------------
 */

import { getVectorStore } from '../vectorstore/vectorstore.factory.js';

/**
 * Returns a LangChain retriever backed by the configured
 * vector store, with a default top‑K of 5.
 *
 * @param {Object} [options] - Overrides for retriever options.
 * @param {number} [options.k=5] - Number of documents to retrieve.
 * @returns {Promise<import('@langchain/core/vectorstores').VectorStoreRetriever>}
 */
export async function getRetriever(options = {}) {
  const vectorStore = await getVectorStore();
  return vectorStore.asRetriever({
    k: 5,
    ...options,
  });
}
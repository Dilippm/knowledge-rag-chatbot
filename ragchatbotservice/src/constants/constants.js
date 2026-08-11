/**
 * -----------------------------------------------------------------------------
 * File: src/constants/constants.js
 *
 * Centralises reusable path and algorithm parameters used
 * across the RAG pipeline.
 *
 * Responsibilities:
 * - Provide absolute paths for document, processed, and
 *   embedding data directories.
 * - Define default chunk size and overlap for text splitting.
 * -----------------------------------------------------------------------------
 */

import path from 'path';

// -----------------------------------------------------------------------------
// Data Directory Paths
// -----------------------------------------------------------------------------

/**
 * Absolute paths to the three data directories consumed and
 * produced by the document processing pipeline.
 */
const DATA_PATHS = {
  DOCUMENTS: path.resolve('data/documents'),
  PROCESSED: path.resolve('data/processed'),
  EMBEDDINGS: path.resolve('data/embeddings'),
};

// -----------------------------------------------------------------------------
// Text Splitting Parameters
// -----------------------------------------------------------------------------

/**
 * Default token-count boundaries used by the document chunk
 * splitter to control fragment size and overlap.
 */
const CHUNK_SPLITTING_STRATEGY = {
  SIZE: 1000,
  OVERLAP: 200,
};

export const CHAT_MEMORY = {
    SUMMARY_THRESHOLD: 2,

    RECENT_EXCHANGE_WINDOW: 3,
     SUMMARY_MAX_WORDS: 200,
};
export const REDIS_MEMORY ={
  EXPIRY : 60*30,
  SESSION_PREFIX : "chat:session:"
}
export default {
  DATA_PATHS,
  CHUNK_SPLITTING_STRATEGY,
  CHAT_MEMORY,
  REDIS_MEMORY
};

/**
 * -----------------------------------------------------------------------------
 * File: src/config/splitter.config.js
 *
 * Maps the chunk-splitting strategy constants into a
 * consumable configuration object.
 *
 * Responsibilities:
 * - Expose chunk size and overlap for the document splitter.
 * -----------------------------------------------------------------------------
 */

import constants from '../constants/constants.js';

/**
 * Chunk size and overlap values used by the text splitter
 * during document ingestion.
 */
export const splitterConfig = {
  chunkSize: constants.CHUNK_SPLITTING_STRATEGY.SIZE,
  chunkOverlap: constants.CHUNK_SPLITTING_STRATEGY.OVERLAP,
};
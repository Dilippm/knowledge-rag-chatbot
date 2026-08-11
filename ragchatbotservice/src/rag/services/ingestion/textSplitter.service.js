/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/ingestion/textSplitter.service.js
 *
 * Splits documents into chunks using a recursive
 * character text splitter.
 *
 * Responsibilities:
 * - Apply configured chunk size and overlap from
 *   splitterConfig.
 * -----------------------------------------------------------------------------
 */

import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { splitterConfig } from '../../../config/splitter.config.js';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: splitterConfig.chunkSize,
  chunkOverlap: splitterConfig.chunkOverlap,
});

export const splitDocuments = async (documents) => {
  if (!Array.isArray(documents)) {
    throw new Error('Documents must be an array.');
  }

  return await splitter.splitDocuments(documents);
};
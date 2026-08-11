/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/ingestion/ingestion.service.js
 *
 * Core ingestion pipeline — loads, normalises, and
 * splits source documents into chunks.
 *
 * Responsibilities:
 * - Run the full three-step pipeline (load, normalise, split).
 * - Assign chunk metadata (id, source) to each fragment.
 * -----------------------------------------------------------------------------
 */

import { loadDocument } from './documentLoader.service.js';
import { normalizeDocuments } from './documentNormalizer.service.js';
import { splitDocuments } from './textSplitter.service.js';

export const ingestDocuments = async (filePaths) => {
  try {
    // Step 1 - Load documents
    const documents = [];

    for (const filePath of filePaths) {
      const loadedDocuments = await loadDocument(filePath);
      documents.push(...loadedDocuments);
    }

    // Step 2 - Normalize metadata
    const normalizedDocuments = normalizeDocuments(documents);

    // Step 3 - Split into chunks
    let chunks = await splitDocuments(normalizedDocuments);
    //Step 4 - add metadata id and chunk index
    chunks = chunks.map((chunk, index) => ({
      ...chunk,
      metadata: {
        ...chunk.metadata,
        chunk: index,
        id: `${chunk.metadata.source}-${index}`,
      },
    }));
    return {
      documentCount: documents.length,
      chunkCount: chunks.length,
      chunks,
    };
  } catch (error) {
    throw new Error(
      `Document ingestion failed in ingestion.service.js : ${error.message}`,
    );
  }
};
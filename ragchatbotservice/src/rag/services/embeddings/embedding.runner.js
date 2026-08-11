/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/embeddings/embedding.runner.js
 *
 * Runs the full embedding pipeline: loads processed
 * documents, generates embeddings for new ones, and
 * persists them.
 *
 * Responsibilities:
 * - Skip already-embedded documents to avoid duplicates.
 * - Load existing embeddings, append new ones, then save.
 * - Return the full set of embeddings.
 * -----------------------------------------------------------------------------
 */

import { generateEmbedding } from './embedding.service.js';
import {
  getProcessedDocuments,
  logSuccess,
  logError,
  saveEmbeddings,
  loadEmbeddings,
} from './embedding.utils.js';

/**
 * Runs the embedding workflow.
 *
 * @returns {Promise<Array>} Updated array of all embedded documents.
 */
export async function runEmbeddingPipeline() {
  const existingEmbeddings = await loadEmbeddings();

  const existingIds = new Set(existingEmbeddings.map((doc) => doc.metadata.id));

  const documents = await getProcessedDocuments();

  const embeddedDocuments = [];

  for (const document of documents) {
    try {
      // Skip already embedded documents to avoid generating duplicate vectors.
      if (existingIds.has(document.metadata.id)) {
        continue;
      }

      const embedding = await generateEmbedding(document.pageContent);

      embeddedDocuments.push({
        pageContent: document.pageContent,
        embedding,
        metadata: {
          ...document.metadata,
        },
      });
    } catch (error) {
      logError(
        `Failed to embed "${document.metadata.source}": ${error.message}`,
      );
      throw new Error(
        `Failed to embed "${document.metadata.source}": ${error.message}`,
      );
    }
  }

  const updatedEmbeddings = [...existingEmbeddings, ...embeddedDocuments];

  await saveEmbeddings(updatedEmbeddings);

  logSuccess('Embeddings saved successfully.');
  return updatedEmbeddings;
}
/**
 * -----------------------------------------------------------------------------
 * File: src/rag/guards/noDocuments.guard.js
 *
 * Handles the case where the retriever returns zero
 * documents for the user's question.
 *
 * Responsibilities:
 * - Detect empty document sets.
 * - Return a low-confidence response when no sources are
 *   available.
 * -----------------------------------------------------------------------------
 */

import { RunnableLambda } from '@langchain/core/runnables';

/**
 * Returns true when no documents were retrieved from the
 * knowledge base.
 *
 * @param {{ documents: Array }} input - Pipeline input.
 * @returns {boolean}
 */
export const hasNoDocuments = (input) =>
  !input.documents || input.documents.length === 0;

/**
 * Returns a low-confidence "no information" response
 * instead of proceeding with an empty context.
 */
export const noDocumentsResponse = RunnableLambda.from(() => ({
  success: true,
  answer:
    "I couldn't find any relevant information in the knowledge base for your question.",
  confidence: 'low',
  sources: [],
}));
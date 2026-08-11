/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/rag/sourceFormatter.service.js
 *
 * Deduplicates source document names.
 *
 * Responsibilities:
 * - Collect unique source names from document metadata.
 * -----------------------------------------------------------------------------
 */

export function formatSources(documents = []) {
  return [...new Set(documents.map((doc) => doc.source ?? 'Unknown'))];
}
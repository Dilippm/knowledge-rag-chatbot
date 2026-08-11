/**
 * -----------------------------------------------------------------------------
 * File: src/rag/builders/contextBuilder.js
 *
 * Builds a formatted context string from retrieved documents
 * for injection into the RAG prompt.
 *
 * Responsibilities:
 * - Join documents with a visual separator.
 * - Return a placeholder when no documents are available.
 * -----------------------------------------------------------------------------
 */

/**
 * Formats an array of retrieved documents into a single
 * labelled, separated context string.
 *
 * @param {Array<{ pageContent: string; metadata: { source?: string; chunk?: string } }>} documents - Retrieved documents.
 * @returns {string} Formatted context.
 */
export function buildContext(documents = []) {
  const DOCUMENT_SEPARATOR =
    '\n\n--------------------------------------------------\n\n';

  if (!documents.length) {
    return 'No relevant documents were retrieved.';
  }

  return documents
    .map((doc, index) => {
      const source = doc.metadata?.source ?? 'Unknown';
      const chunk = doc.metadata?.chunk ?? 'N/A';

      return [
        `Document ${index + 1}`,
        `Source: ${source}`,
        `Chunk: ${chunk}`,
        '',
        doc.pageContent.trim(),
      ].join('\n');
    })
    .join(DOCUMENT_SEPARATOR);
}
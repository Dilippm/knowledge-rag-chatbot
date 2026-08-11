/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/ingestion/documentNormalizer.service.js
 *
 * Appends derived metadata (project name, source type)
 * to each ingested document.
 *
 * Responsibilities:
 * - Extract project name from the file path.
 * - Classify document type by extension.
 * -----------------------------------------------------------------------------
 */

import path from 'path';

export function normalizeDocuments(documents) {
  return documents.map((document) => {
    const source = document.metadata.source;

    return {
      ...document,

      metadata: {
        ...document.metadata,

        fullPath: source,

        project: getProjectName(source),

        source: path.basename(source),

        type: getDocumentType(source),
      },
    };
  });
}

function getProjectName(filePath) {
  const parts = filePath.split(path.sep);

  const projectIndex = parts.indexOf('documents') + 1;

  return parts[projectIndex];
}

function getDocumentType(filePath) {
  const extension = path.extname(filePath);

  switch (extension) {
    case '.md':
      return 'markdown';

    case '.pdf':
      return 'pdf';

    case '.txt':
      return 'text';

    case '.json':
      return 'json';

    default:
      return 'unknown';
  }
}
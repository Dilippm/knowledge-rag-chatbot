/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/ingestion/documentLoader.service.js
 *
 * Loads a single file using LangChain's TextLoader.
 *
 * Responsibilities:
 * - Load a file by path into a LangChain document.
 * -----------------------------------------------------------------------------
 */

import { TextLoader } from '@langchain/classic/document_loaders/fs/text';

export async function loadDocument(filePath) {
  const loader = new TextLoader(filePath);

  return await loader.load();
}
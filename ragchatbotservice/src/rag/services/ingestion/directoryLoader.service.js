/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/ingestion/directoryLoader.service.js
 *
 * Reads a project directory and collects file paths
 * for ingestion.
 *
 * Responsibilities:
 * - Enumerate all markdown files in the project directory.
 * -----------------------------------------------------------------------------
 */

import { readdir } from 'fs/promises';
import path from 'path';

export async function loadDirectory(directoryPath) {
  const files = await readdir(directoryPath);

  const documents = [];

  for (const file of files) {
    // Only process markdown files

    // Create the complete file path
    const filePath = path.join(directoryPath, file);

    // Merge returned documents
    documents.push(filePath);
  }

  return documents;
}
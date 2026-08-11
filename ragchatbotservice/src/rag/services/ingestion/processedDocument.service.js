/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/ingestion/processedDocument.service.js
 *
 * Persists processed document chunks to disk.
 *
 * Responsibilities:
 * - Write the chunk array as JSON to the processed
 *   directory.
 * -----------------------------------------------------------------------------
 */

import fs from 'fs/promises';
import path from 'path';
import constants from '../../../constants/constants.js';

const PROCESSED_DIR = constants.DATA_PATHS.PROCESSED;
const OUTPUT_FILE = path.join(PROCESSED_DIR, 'processed-file.json');

export async function saveProcessedDocuments(chunks) {
  await fs.mkdir(PROCESSED_DIR, { recursive: true });

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(chunks, null, 2), 'utf-8');

  return OUTPUT_FILE;
}
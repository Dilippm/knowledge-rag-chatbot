/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/embeddings/embedding.utils.js
 *
 * I/O helpers for the embedding pipeline — read, write,
 * and validate processed document data.
 *
 * Responsibilities:
 * - Load and parse the processed-file JSON.
 * - Save and load embeddings from disk.
 * - Validate document structure before processing.
 * - Provide logging helpers.
 * -----------------------------------------------------------------------------
 */

import fs from 'fs/promises';
import path from 'path';
import logger from '../../../config/logger.config.js';
import constants from '../../../constants/constants.js';

const PROCESSED_DIR = constants.DATA_PATHS.PROCESSED;
const PROCESSED_FILE = path.join(PROCESSED_DIR, 'processed-file.json');

const EMBEDDING_DIR = constants.DATA_PATHS.EMBEDDINGS;

const EMBEDDING_FILE = path.join(EMBEDDING_DIR, 'embeddings.json');

/**
 * Load processed document chunks.
 */
export async function loadProcessedDocuments() {
  const data = await fs.readFile(PROCESSED_FILE, 'utf-8');
  return JSON.parse(data);
}

/**
 * Ensure embeddings output directory exists.
 */
export async function ensureEmbeddingsDirectory() {
  await fs.mkdir(EMBEDDING_DIR, {
    recursive: true,
  });
}

/**
 * Save generated embeddings.
 */
export async function saveEmbeddings(documents) {
  await ensureEmbeddingsDirectory();

  await fs.writeFile(
    EMBEDDING_FILE,
    JSON.stringify(documents, null, 2),
    'utf-8',
  );
}

/**
 * Validate a single processed document.
 */
export function isValidDocument(document) {
  return (
    document &&
    typeof document.pageContent === 'string' &&
    document.pageContent.trim().length > 0 &&
    document.metadata &&
    typeof document.metadata === 'object'
  );
}

/**
 * Load and validate processed documents.
 * Invalid records are skipped.
 */
export async function getProcessedDocuments() {
  const documents = await loadProcessedDocuments();

  if (!Array.isArray(documents)) {
    throw new Error('Processed document file must contain an array.');
  }

  const validDocuments = [];

  for (const document of documents) {
    if (isValidDocument(document)) {
      validDocuments.push(document);
    }
  }

  return validDocuments;
}

export async function loadEmbeddings() {
  try {
    const data = await fs.readFile(EMBEDDING_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

export function logInfo(message) {
  logger.info(`${message}`);
}

export function logSuccess(message) {
  logger.info(`${message}`);
}

export function logError(message) {
  logger.error(`${message}`);
}
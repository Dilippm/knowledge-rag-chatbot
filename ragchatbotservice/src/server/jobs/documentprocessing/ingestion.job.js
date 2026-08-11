/**
 * -----------------------------------------------------------------------------
 * File: src/server/jobs/documentprocessing/ingestion.job.js
 *
 * Orchestrator for the file-ingestion stage of the
 * document-processing pipeline.
 *
 * Responsibilities:
 * - Load files from disk, ingest them into chunks,
 *   and persist the processed documents.
 * -----------------------------------------------------------------------------
 */

import path from 'path';
import logger from '../../../config/logger.config.js';
import constants from '../../../constants/constants.js';

import { loadDirectory } from '../../../rag/services/ingestion/directoryLoader.service.js';
import { ingestDocuments } from '../../../rag/services/ingestion/ingestion.service.js';
import { saveProcessedDocuments } from '../../../rag/services/ingestion/processedDocument.service.js';

/**
 * Ingests files from a project directory: loads files, chunks
 * them via the ingestion service, and saves the processed
 * document JSON for downstream stages.
 *
 * @param {string} projectName - Name of the project to ingest.
 * @returns {Promise<void>}
 */
export const runIngestionJob = async (projectName) => {
  logger.info('========== INGESTION STARTED ==========');

  const documentPath = path.join(constants.DATA_PATHS.DOCUMENTS, projectName);

  const files = await loadDirectory(documentPath);

  logger.info(`${files.length} files found`);

  const data = await ingestDocuments(files);

  logger.info(`${data.chunks.length} chunks created`);

  await saveProcessedDocuments(data.chunks);

  logger.info('Processed document JSON created and INGESTION COMPLETED');
};
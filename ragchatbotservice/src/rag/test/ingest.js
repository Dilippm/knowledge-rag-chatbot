/**
 * -----------------------------------------------------------------------------
 * File: src/rag/test/ingest.js
 *
 * Sandbox script — tests the full ingest pipeline from
 * a local directory.
 * -----------------------------------------------------------------------------
 */

import logger from '../config/logger.config.js';
import { loadDirectory } from '../services/ingestion/directoryLoader.service.js';
import { ingestDocuments } from '../services/ingestion/ingestion.service.js';
import { saveProcessedDocuments } from '../services/ingestion/processedDocument.service.js';

const files = await loadDirectory('./data/documents/cts');
const stats = {
  md: 0,
  pdf: 0,
  txt: 0,
  docx: 0,
};

for (const file of files) {
  if (file.endsWith('.md')) stats.md++;
  else if (file.endsWith('.pdf')) stats.pdf++;
  else if (file.endsWith('.txt')) stats.txt++;
  else if (file.endsWith('.docx')) stats.docx++;
}
const data = await ingestDocuments(files);

const outputPath = await saveProcessedDocuments(data.chunks);

logger.info(`Ingestion completed successfully and saved to :${outputPath}`);
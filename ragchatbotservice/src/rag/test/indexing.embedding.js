/**
 * -----------------------------------------------------------------------------
 * File: src/rag/test/indexing.embedding.js
 *
 * Quick integration test — runs the indexing pipeline
 * and prints the result.
 * -----------------------------------------------------------------------------
 */

import { indexDocuments } from '../services/vectorstore/indexing.service.js';

const result = await indexDocuments();


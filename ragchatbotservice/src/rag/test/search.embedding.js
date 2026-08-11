/**
 * -----------------------------------------------------------------------------
 * File: src/rag/test/search.embedding.js
 *
 * Quick integration test — runs a similarity search and
 * prints the results.
 * -----------------------------------------------------------------------------
 */

import { searchDocuments } from '../services/vectorstore/search.service.js';

const results = await searchDocuments('How does the inspection pipeline work?');

console.log(results);
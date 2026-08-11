/**
 * -----------------------------------------------------------------------------
 * File: src/rag/test/verifyEmbeddingModel.js
 *
 * Integration test — runs the embedding pipeline and
 * inspects the output.
 * -----------------------------------------------------------------------------
 */

// import { generateEmbedding } from "../services/embeddings/embedding.service.js";

// const embedding = await generateEmbedding("Hello World");

// console.log(embedding.length);

import { runEmbeddingPipeline } from '../services/embeddings/embedding.runner.js';

const documents = await runEmbeddingPipeline();

console.log(documents.length);

console.log(documents[0]);
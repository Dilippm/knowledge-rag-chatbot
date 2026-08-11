/**
 * -----------------------------------------------------------------------------
 * File: src/rag/test/testRagChain.js
 *
 * CLI script — runs a question through the full RAG
 * pipeline and prints the response.
 * -----------------------------------------------------------------------------
 */

import { askQuestion } from '../services/rag/questionAnswering.service.js';

async function main() {
  const question = process.argv.slice(2).join(' ');

  if (!question) {
    console.error('Usage: npm run test:rag "Your question"');
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('Question:');
  console.log(question);
  console.log('========================================\n');

  const response = await askQuestion(question);

  console.log('\n========== RESPONSE ==========\n');

  console.log('res:', response);
}

main().catch(console.error);
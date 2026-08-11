/**
 * -----------------------------------------------------------------------------
 * File: src/rag/test/testPromptBuilder.js
 *
 * CLI script — builds a RAG prompt from a user question
 * and prints the formatted prompt.
 * -----------------------------------------------------------------------------
 */

import { buildPrompt } from '../builders/promptBuilder.js';
import { getRetriever } from '../services/retriever/vectostore.retriever.js';

async function main() {
  const question = process.argv.slice(2).join(' ');

  if (!question) {
    console.error('Usage: npm run test:prompt "Your question"');
    process.exit(1);
  }

  const retriever = getRetriever();

  const documents = await retriever.invoke(question);

  const prompt = await buildPrompt(question, documents);

  console.log('\n========== FORMATTED PROMPT ==========\n');

  console.log(prompt.toString());
}

main().catch(console.error);
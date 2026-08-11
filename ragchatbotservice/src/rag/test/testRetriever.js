/**
 * -----------------------------------------------------------------------------
 * File: src/rag/test/testRetriever.js
 *
 * CLI script — retrieves documents for a question
 * and prints the formatted context.
 * -----------------------------------------------------------------------------
 */

import { buildContext } from '../builders/contextBuilder.js';
import { getRetriever } from '../services/retriever/vectostore.retriever.js';

async function main() {
  const question = process.argv.slice(2).join(' ');

  if (!question) {
    console.error('Usage:');
    console.error('npm run test:retriever "Your question here"');
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('Question:');
  console.log(question);
  console.log('========================================\n');
  const retriever = getRetriever();
  const documents = await retriever.invoke(question);

  console.log(`Retrieved ${documents.length} document(s).\n`);

  //   documents.forEach((doc, index) => {
  //     console.log(`Document ${index + 1}`);
  //     console.log("----------------------------");
  //     console.log("Source :", doc.metadata?.source ?? "Unknown");
  //     console.log("Chunk  :", doc.metadata?.chunk ?? "N/A");
  //     console.log("Content:");
  //     console.log(doc.pageContent);
  //     console.log("\n");
  //   });

  console.log('========================================');
  console.log('Formatted Context');
  console.log('========================================\n');

  console.log(buildContext(documents));
}

main().catch((error) => {
  console.error('Retriever Test Failed');
  console.error(error);
});
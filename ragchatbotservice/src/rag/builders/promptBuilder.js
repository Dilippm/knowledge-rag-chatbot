/**
 * -----------------------------------------------------------------------------
 * File: src/rag/builders/promptBuilder.js
 *
 * Assembles a full RAG prompt by combining the user's
 * question with the retrieved context.
 *
 * Responsibilities:
 * - Validate that a question is provided.
 * - Build context from retrieved documents.
 * - Invoke the LangChain rag prompt with context and question.
 * -----------------------------------------------------------------------------
 */

import { ragPrompt } from '../../prompts/rag.prompt.js';
import { buildContext } from './contextBuilder.js';

/**
 * Builds a RAG prompt by merging the question with the
 * retrieved context, then invoking the prompt template.
 *
 * @param {string} question - The user's question.
 * @param {Array} [documents=[]] - Retrieved documents for context.
 * @returns {Promise<import('@langchain/core/prompts').PromptValue>}
 * @throws {Error} If question is empty or missing.
 */
export async function buildPrompt(question, documents = []) {
  if (!question?.trim()) {
    throw new Error('Question is required.');
  }

  const context = buildContext(documents);

  return await ragPrompt.invoke({
    context,
    question,
  });
}
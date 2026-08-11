/**
 * -----------------------------------------------------------------------------
 * File: src/rag/guards/question.guard.js
 *
 * Validates the user's question before it enters the
 * RAG pipeline.
 *
 * Responsibilities:
 * - Reject empty or non-string questions.
 * * -----------------------------------------------------------------------------
 */

import { RunnableLambda } from '@langchain/core/runnables';

/**
 * Returns true when the question is empty, missing, or
 * not a string.
 *
 * @param {string} question - The user's question.
 * @returns {boolean}
 */
export const isInvalidQuestion = (input) => {
  let question = input.question;
  typeof question !== 'string' || question.trim().length === 0;
}
/**
 * Returns a failure response for invalid questions.
 */
export const invalidQuestionResponse = RunnableLambda.from(() => ({
  success: false,
  answer: 'Question cannot be empty.',
  confidence: 'low',
  sources: [],
}));
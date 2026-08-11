/**
 * -----------------------------------------------------------------------------
 * File: src/rag/guards/greeting.guard.js
 *
 * Detects common user greetings and returns a
 * predefined response.
 *
 * Responsibilities:
 * - Identify greeting patterns (hi, hello, hey, etc.).
 * - Short-circuit the RAG pipeline when a greeting is detected.
 * -----------------------------------------------------------------------------
 */

import { RunnableLambda } from '@langchain/core/runnables';

const GREETINGS = [
  'hi',
  'hello',
  'hey',
  'good morning',
  'good afternoon',
  'good evening',
];

/**
 * Checks whether the user's question is a simple greeting.
 *
 * @param {string} question - The user's question.
 * @returns {boolean} True if it matches a known greeting.
 */
export const isGreeting = (input) => {
  let question = input.question
  if (typeof question !== 'string') {
    return false;
  }

  return GREETINGS.includes(question.trim().toLowerCase());
};

/**
 * Returns a friendly greeting response without invoking the
 * full RAG pipeline.
 */
export const greetingResponse = RunnableLambda.from(() => ({
  success: true,
  answer: 'Hello! How can I assist you today?',
  confidence: 'high',
  sources: [],
}));
/**
 * -----------------------------------------------------------------------------
 * File: src/rag/guards/instruction.guard.js
 *
 * Detects prompt-injection or instruction-manipulation
 * attempts in the user's question.
 *
 * Responsibilities:
 * - Block attempts to override the system prompt.
 * - Block jailbreak / role-play patterns.
 * -----------------------------------------------------------------------------
 */

import { RunnableLambda } from '@langchain/core/runnables';

const INSTRUCTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions?/i,
  /ignore\s+the\s+system\s+prompt/i,
  /reveal\s+(your\s+)?system\s+prompt/i,
  /show\s+(your\s+)?system\s+prompt/i,
  /developer\s+message/i,
  /system\s+message/i,
  /forget\s+(all\s+)?previous\s+instructions?/i,
  /forget\s+the\s+context/i,
  /act\s+as\s+/i,
  /pretend\s+to\s+be/i,
  /you\s+are\s+now/i,
  /jailbreak/i,
];

/**
 * Checks whether the question contains instruction-manipulation
 * patterns (jailbreak, prompt injection, etc.).
 *
 * @param {string} question - The user's question.
 * @returns {boolean} True if a known attack pattern is found.
 */
export const isInstructionAttack = (input) => {
  let question = input.question;

  if (typeof question !== 'string') {
    return false;
  }

  return INSTRUCTION_PATTERNS.some((pattern) => pattern.test(question));
};

/**
 * Returns a rejection response when an instruction attack
 * is detected.
 */
export const instructionAttackResponse = RunnableLambda.from(() => ({
  success: false,
  answer:
    "Your request contains instructions that attempt to modify the assistant's behavior. Please ask a question related to the knowledge base instead.",
  confidence: 'high',
  sources: [],
}));
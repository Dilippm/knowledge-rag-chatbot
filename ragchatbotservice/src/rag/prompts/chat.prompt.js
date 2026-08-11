/**
 * -----------------------------------------------------------------------------
 * File: src/rag/prompts/chat.prompt.js
 *
 * Simple system + human prompt template for general
 * chat interactions.
 *
 * Responsibilities:
 * - Define a basic "answer clearly" system persona.
 * - Accept a user question as the sole input variable.
 * -----------------------------------------------------------------------------
 */

import { ChatPromptTemplate } from '@langchain/core/prompts';

/**
 * Chat prompt template with a system instruction for
 * helpful, honest responses and a human {question} slot.
 */
export const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `
You are a helpful AI assistant.

Answer clearly.

If you don't know something, say you don't know.
        `,
  ],
  ['human', '{question}'],
]);
/**
 * -----------------------------------------------------------------------------
 * File: src/rag/prompts/rag.prompt.js
 *
 * RAG prompt template — injects retrieved context and
 * the user question into a system prompt.
 *
 * Responsibilities:
 * - Combine context and question into a single prompt for
 *   the LLM.
 * -----------------------------------------------------------------------------
 */

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { SYSTEM_PROMPT } from './system.prompt.js';

/**
 * RAG prompt template that feeds the system instructions,
 * retrieved context, and user question to the LLM.
 */
export const ragPrompt = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_PROMPT],
  [
    'human',

    `
Conversation Summary:
{summary}

Recent Conversation:
{history}

Retrieved Context:
{context}

Current Question:
{question}

`,
  ],
]);
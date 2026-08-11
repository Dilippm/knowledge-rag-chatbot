/**
 * -----------------------------------------------------------------------------
 * File: src/rag/chains/chat.chain.js
 *
 * Simple LangChain pipeline for basic chat.
 *
 * Responsibilities:
 * - Pipe a chat prompt through the LLM and parse the output.
 * -----------------------------------------------------------------------------
 */

import { StringOutputParser } from '@langchain/core/output_parsers';

import { chatPrompt } from '../prompts/chat.prompt.js';
import * as llmService from '../services/llm/llm.service.js';

const outputParser = new StringOutputParser();

/**
 * LangChain runnable sequence: chat prompt → LLM model → string output.
 */
export const chatChain = chatPrompt
  .pipe(llmService.getModel())
  .pipe(outputParser);
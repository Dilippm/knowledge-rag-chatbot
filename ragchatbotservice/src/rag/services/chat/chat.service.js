/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/chat/chat.service.js
 *
 * Orchestrates chat flows — delegates to the chat chain
 * or the full RAG question-answering service.
 *
 * Responsibilities:
 * - Route chat-test requests through the simple chat chain.
 * - Route production requests through the RAG pipeline.
 * -----------------------------------------------------------------------------
 */

import { chatChain } from '../../chains/chat.chain.js';
import logger from '../../../config/logger.config.js';
import { askQuestion } from '../rag/questionAnswering.service.js';
import { getConversation, saveConversation } from '../memory/sessionManager.service.js';
import { updateConversation } from '../memory/memory.service.js';
import { shouldSummarize, summarizeConversation } from '../memory/summary.service.js';

/**
 * Sends a message through the simple chat chain (no RAG).
 *
 * @param {string} message - The user's message.
 * @returns {Promise<string>} The model's response.
 */
const chatTest = async (message) => {
  try {
    logger.info(`Processing chat request...`);

    const response = await chatChain.invoke({
      question: message,
    });

    return response;
  } catch (error) {
    logger.error(`Chat Service Error: ${error.message}`);

    throw new Error('Unable to process chat request.');
  }
};

/**
 * Runs the full RAG pipeline — retrieves context, generates
 * an answer, and returns the result.
 *
 * @param {string} question - The user's question.
 * @returns {Promise<Object>} The RAG response.
 */
const ragChat = async (question,sessionId) => {
 
   const conversation = await getConversation(sessionId);
  const result = await askQuestion(question,conversation);

  updateConversation(
    conversation,
    question,
    result.data.answer
);
if (shouldSummarize(conversation)) {
    await summarizeConversation(conversation);
}
 await saveConversation(conversation);
  return result;
};

export default {
  chatTest,
  ragChat,
};

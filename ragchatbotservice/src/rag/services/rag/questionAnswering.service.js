/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/rag/questionAnswering.service.js
 *
 * Validates the user question and delegates to the
 * RAG response generator.
 *
 * Responsibilities:
 * - Guard against empty questions.
 * - Log errors with full context on failure.
 * -----------------------------------------------------------------------------
 */

import logger from '../../../config/logger.config.js';
import { buildConversationHistory } from '../../builders/conversationBuilder.js';
import { getRecentMessages } from '../memory/summary.service.js';
import { generateResponse } from './responseGenerator.rag.js';

export const askQuestion = async (question,conversation) => {
  try {
    if (!question?.trim()) {
      throw new Error('Question is required.');
    }

const recentMessages = getRecentMessages(conversation.messages);

    const response = await generateResponse({
    question,
    summary: conversation.summary,
    history: buildConversationHistory(recentMessages),
});

    logger.info('Question answered successfully.');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    logger.error('RAG chain execution failed.', {
      question,
      error,
      errormessage: error.message,
    });
  

    return {
      success: false,
      message: 'An unexpected error occurred while processing your request.',
    };
  }
};
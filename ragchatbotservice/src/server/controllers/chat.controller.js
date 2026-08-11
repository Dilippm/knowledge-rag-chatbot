/**
 * -----------------------------------------------------------------------------
 * File: src/server/controllers/chat.controller.js
 *
 * Handles chat-related requests — both the RAG chat flow
 * and a test endpoint.
 *
 * Responsibilities:
 * - Validate incoming request body for chatTest.
 * - Delegate to the chat service and return responses.
 * -----------------------------------------------------------------------------
 */

import logger from '../../config/logger.config.js';
import chatService from '../../rag/services/chat/chat.service.js';

/**
 * Sends a plain message to the chat service for testing
 * purposes without the full RAG pipeline.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const chatTest = async (req, res, next) => {
  try {
    const { message } = req.body;

    // Validate request body
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.',
      });
    }
    const answer = await chatService.chatTest(message);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    logger.error(`chatTest controller Error: ${error.message}`);
    next(error);
  }
};

/**
 * Runs the full RAG chat pipeline for a user question.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const ragChat = async (req, res, next) => {
  try {
    const { question,sessionId } = req.body;

    const response = await chatService.ragChat(question,sessionId);

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export default {
  chatTest,
  ragChat,
};
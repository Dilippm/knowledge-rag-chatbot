/**
 * -----------------------------------------------------------------------------
 * File: src/server/validators/chat.validator.js
 *
 * Express-validator rule set for the chat endpoint.
 *
 * Responsibilities:
 * - Validate and sanitise the `question` field in
 *   incoming chat requests.
 * -----------------------------------------------------------------------------
 */

import { body } from 'express-validator';

/**
 * Validation rules for chat requests.
 *
 * Ensures the question is a non-empty string between
 * 2 and 1000 characters.
 */
export const chatValidationRules = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required.')
    .isString()
    .withMessage('Question must be a string.')
    .isLength({ min: 2 })
    .withMessage('Question must be at least 2 characters long.')
    .isLength({ max: 1000 })
    .withMessage('Question cannot exceed 1000 characters.'),
];



export const validateChatPayload = (payload) => {
  if (!payload) {
    return {
      valid: false,
      error: "Payload is required.",
    };
  }
  if(!payload.sessionId){
    return {
      valid: false,
      error: "Session ID is required.",
    };
  }

  if (typeof payload.message !== "string") {
    return {
      valid: false,
      error: "Message must be a string.",
    };
  }
if (typeof payload.sessionId !== "string") {
    return {
        valid: false,
        error: "Session ID is required."
    };
}
  if (!payload.message.trim()) {
    return {
      valid: false,
      error: "Message cannot be empty.",
    };
  }

  return {
    valid: true,
  };
};
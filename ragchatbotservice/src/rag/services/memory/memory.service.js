import { createConversation } from "../../models/conversation.model.js";


/**
 * Creates a new conversation object.
 *
 * @param {string} sessionId
 * @returns {Object}
 */
export const createMemory = (sessionId) => {
    const now = new Date();

return createConversation(sessionId);
};

/**
 * Adds a message to the conversation.
 *
 * @param {Object} conversation
 * @param {"user" | "assistant"} role
 * @param {string} content
 * @returns {Object}
 */
export const addMessage = (conversation, role, content) => {
  conversation.messages.push({
    role,
    content,
    timestamp: new Date(),
  });

  conversation.messageCount++;

  const now = new Date();

  conversation.updatedAt = now;
  conversation.lastActivity = now;
};


/**
 * Updates the conversation summary.
 *
 * @param {Object} conversation
 * @param {string} summary
 * @returns {Object}
 */
export const updateSummary = (conversation, summary) => {
    conversation.summary = summary;

    conversation.updatedAt = new Date();

    return conversation;
};

/**
 * Updates the last activity timestamp.
 *
 * @param {Object} conversation
 * @returns {Object}
 */
export const updateLastActivity = (conversation) => {
    conversation.lastActivity = new Date();

    return conversation;
};

export const touchConversation = (conversation) => {
    const now = new Date();

    conversation.updatedAt = now;
    conversation.lastActivity = now;

    return conversation;
};

export const updateConversation = (
  conversation,
  question,
  answer
) => {
  addMessage(conversation, "user", question);

  addMessage(conversation, "assistant", answer);

  return conversation;
};
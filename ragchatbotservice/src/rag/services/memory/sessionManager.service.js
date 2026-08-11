import {  createMemory } from "./memory.service.js";
import { get,set,del, expire } from "../redis/redis.service.js";
import { REDIS_MEMORY } from "../../../constants/constants.js";
const SESSION_PREFIX = REDIS_MEMORY.SESSION_PREFIX;
const sessions = new Map();

const getSessionKey = (sessionId) => {
    return `${SESSION_PREFIX}${sessionId}`;
};
/**
 * Returns an existing conversation or creates a new one.
 *
 * @param {string} sessionId
 * @returns {Object}
 */
export const getConversation = async (sessionId) => {
  try {
    const key = getSessionKey(sessionId);

    let conversation = await get(key);

    if (!conversation) {
      conversation = createMemory(sessionId);
      await saveConversation(conversation);
    } else {
      conversation.lastSummarizedMessageCount ??= 0;
    }

    return conversation;
  } catch (error) {
    logger.error(`Failed to load conversation: ${error.message}`);

    // Return an empty conversation so chat can continue
    return createMemory(sessionId);
  }
};

/**
 * Returns a conversation without creating one.
 *
 * @param {string} sessionId
 * @returns {Object|null}
 */
export const findConversation = async (sessionId) => {
  try {
    return await get(getSessionKey(sessionId));
  } catch (error) {
    logger.error(`Failed to find conversation: ${error.message}`);
    return null;
  }
};
// /**
//  * Checks whether a session exists.
//  *
//  * @param {string} sessionId
//  * @returns {boolean}
//  */
// export const hasSession = async (sessionId) => {
//   try {
//     return await exists(getSessionKey(sessionId));
//   } catch (error) {
//     logger.error(`Failed to check session: ${error.message}`);
//     return false;
//   }
// };

/**
 * Deletes a conversation.
 *
 * @param {string} sessionId
 * @returns {boolean}
 */
export const deleteConversation = async (sessionId) => {
  try {
    return await del(getSessionKey(sessionId));
  } catch (error) {
    logger.error(`Failed to delete conversation: ${error.message}`);
    return false;
  }
};
/**
 * Returns all active session IDs.
 *
 * @returns {string[]}
 */
export const getActiveSessions = () => {
    return [...sessions.keys()];
};

/**
 * Returns the number of active sessions.
 *
 * @returns {number}
 */
export const getSessionCount = () => {
    return sessions.size;
};

export const saveConversation = async (conversation) => {
  try {
    const key = getSessionKey(conversation.sessionId);

    conversation.updatedAt = new Date().toISOString();

    await set(key, conversation);
    await expire(key);
  } catch (error) {
    logger.error(`Failed to save conversation: ${error.message}`);
  }
};
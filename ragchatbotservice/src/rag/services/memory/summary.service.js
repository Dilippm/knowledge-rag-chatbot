/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/memory/summary.service.js
 *
 * Determines when a conversation should be summarized.
 *
 * Responsibilities:
 * - Check whether summarization is required.
 * -----------------------------------------------------------------------------
 */

import { CHAT_MEMORY } from "../../../constants/constants.js";
import { buildConversationHistory } from "../../builders/conversationBuilder.js";
import { summaryPrompt } from "../../prompts/summary.prompt.js";
import * as llmService from "../llm/llm.service.js"
const model = llmService.getModel();
/**
 * Determines whether the conversation should be summarized.
 *
 * @param {Object} conversation
 * @returns {boolean}
 */
export const shouldSummarize = (conversation) => {
  const pendingMessages =
        conversation.messages.length -
        conversation.lastSummarizedMessageCount;

    return pendingMessages >= CHAT_MEMORY.SUMMARY_THRESHOLD;
};

export const generateSummary = async (conversation) => {
    const newMessages = conversation.messages.slice(
        conversation.lastSummarizedMessageCount
    );

    const history =buildConversationHistory(newMessages);

    const prompt =
        await summaryPrompt.invoke({

            summary: conversation.summary,

            conversation: history,
        });

    const response = await model.invoke(prompt);

    return response.content;
};


export const trimConversation = (conversation) => {
const RECENT_MESSAGE_WINDOW = CHAT_MEMORY.RECENT_EXCHANGE_WINDOW * 2;
    conversation.messages =
        conversation.messages.slice(
            -RECENT_MESSAGE_WINDOW
        );

    return conversation;
};



export const summarizeConversation =
    async (conversation) => {

        const summary = await generateSummary(conversation);

        conversation.summary = summary;
        conversation.lastSummarizedMessageCount = conversation.messages.length;

        // trimConversation(
        //     conversation
        // );

        return conversation;
};

export const getRecentMessages = (messages) => {

    if (!Array.isArray(messages)) {
        return [];
    }
    const RECENT_MESSAGE_WINDOW = CHAT_MEMORY.RECENT_EXCHANGE_WINDOW * 2;

    return messages.slice(-(RECENT_MESSAGE_WINDOW));
};


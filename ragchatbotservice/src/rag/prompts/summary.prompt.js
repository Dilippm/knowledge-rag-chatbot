import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CHAT_MEMORY } from "../../constants/constants.js";

export const summaryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are responsible for maintaining a concise conversation summary.

Your task is to update the existing summary using the new conversation.

Rules:

- Keep only important facts.
- Remove unnecessary details.
- Preserve technical context.
- Preserve user preferences.
- Produce a concise summary.
- Do not exceed ${CHAT_MEMORY.SUMMARY_MAX_WORDS} words.`,
  ],

  [
    "human",
    `
Current Summary:

{summary}

New Conversation:

{conversation}

Return the updated summary only.
`,
  ],
]);
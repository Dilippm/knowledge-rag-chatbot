/**
 * Converts conversation messages into a prompt-friendly format.
 *
 * @param {Array} messages
 * @returns {string}
 */
export const buildConversationHistory = (messages = []) => {
    if (!messages.length) {
        return "";
    }

    return messages
        .map(({ role, content }) => {
            const speaker = role === "user"
                ? "User"
                : "Assistant";

            return `${speaker}: ${content}`;
        })
        .join("\n");
};
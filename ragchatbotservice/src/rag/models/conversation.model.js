

export const createConversation = (sessionId) => {
    const now = new Date();

    return {
    sessionId,

    summary: "",

    messages: [],

    messageCount: 0,

    createdAt: now,

    updatedAt: now,

    lastActivity: now,
    
    lastSummarizedMessageCount: 0
};
};
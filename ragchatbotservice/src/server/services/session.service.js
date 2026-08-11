import { deleteConversation } from "../../rag/services/memory/sessionManager.service.js";

const terminateSession = async (sessionId) => {
  await deleteConversation(sessionId);

  return {
    success: true,
  };
};

export {
  terminateSession,
};

import { CHAT_EVENTS } from "../events/chat.events.js";
import chatService from "../../../rag/services/chat/chat.service.js"
import {
  emitChatError,
  emitTyping,
} from "../emitters/chat.emitter.js";
import { validateChatPayload } from "../../validators/chat.validator.js";
import logger from "../../../config/logger.config.js";
import { terminateSession } from "../../services/session.service.js";

const registerChatEvents = (socket) => {
  socket.on(CHAT_EVENTS.MESSAGE, async (payload) => {

  const { message } = payload;

const sessionId = socket.data.sessionId;
    logger.info(`Chat message received from ${socket.id}`);

    // Validate payload
    const validation = validateChatPayload({message,sessionId});

    if (!validation.valid) {
      emitChatError(socket, validation.error);
      return;
    }
try {
    // Notify client that processing has started
    emitTyping(socket, true);

 //const answer = await chatService.ragChat(payload.message);
 const answer = await chatService.ragChat(message,sessionId);

 socket.emit(CHAT_EVENTS.RESPONSE,{
  success:true,
  answer
 })
} catch (error) {
    logger.error(`Socket Chat Error: ${error.message}`);

      emitChatError(socket, error.message);
}   finally{
    emitTyping(socket, false);
} 


  });

 socket.on(CHAT_EVENTS.SESSION_TERMINATE, async () => {
  try {
     const sessionId = socket.data.sessionId;
    await terminateSession(sessionId);

    socket.emit(CHAT_EVENTS.SESSION_TERMINATED, {
      success: true,
    });
  } catch (error) {
    emitChatError(socket, error.message);
  }
});
};



export default registerChatEvents;
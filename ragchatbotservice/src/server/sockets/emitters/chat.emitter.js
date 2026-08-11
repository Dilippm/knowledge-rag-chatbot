import { CHAT_EVENTS } from "../events/chat.events.js";

export const emitChatError = (socket, message) => {
  socket.emit(CHAT_EVENTS.ERROR, {
    success: false,
    message,
  });
};


export const emitChatConnected = (socket) => {
  socket.emit(CHAT_EVENTS.CONNECTED, {
    success: true,
    socketId: socket.id,
    message: "Connected successfully.",
  });
};

export const emitTyping = (socket, typing = true) => {
  socket.emit(CHAT_EVENTS.TYPING, {
    typing,
  });
};

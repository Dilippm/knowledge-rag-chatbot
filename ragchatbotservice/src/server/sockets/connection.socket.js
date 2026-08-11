import logger from "../../config/logger.config.js";
import { emitChatConnected } from "./emitters/chat.emitter.js";
import registerChatEvents from "./handlers/chat.handles.js";


const registerConnection = (io) => {
    io.on("connection", (socket) => {

        logger.info(`Client connected: ${socket.id}`);
        // Send connection acknowledgement
    emitChatConnected(socket);
      registerChatEvents(socket);
        socket.on("disconnect", () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });

    });
};

export default registerConnection;
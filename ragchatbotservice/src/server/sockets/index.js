import { Server } from "socket.io";
import logger from "../../config/logger.config.js";
import { appConfig } from "../../config/app.config.js";
import middleware from "../middleware/index.js";

let io;
export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: appConfig.client.url,
            methods: ["GET", "POST"],
        },
    });
 
io.use(middleware.authMiddlewares.socketAuthMiddleware);
    logger.info(`Socket.IO initialized`);

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error(`Socket.IO has not been initialized.`);
    }

    return io;
};

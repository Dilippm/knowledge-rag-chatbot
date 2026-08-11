/**
 * -----------------------------------------------------------------------------
 * File: src/server/server.js
 *
 * Boots the Express HTTP server and orchestrates graceful
 * shutdown when the process receives SIGINT or SIGTERM.
 *
 * Responsibilities:
 * - Bind the Express app to the configured port.
 * - Drain active connections and release resources on shutdown.
 * - Wire OS signal handlers to the shutdown routine.
 * -----------------------------------------------------------------------------
 */
import http from "http";
import app from './app.js';
import { appConfig } from '../config/app.config.js';
import logger from '../config/logger.config.js';
import { closeVectorStore } from '../rag/services/vectorstore/vectorstore.factory.js';
import { initializeSocket } from "./sockets/index.js";
import registerConnection from "./sockets/connection.socket.js";

const server = http.createServer(app);
const io = initializeSocket(server);
registerConnection(io);

//Start server
server.listen(appConfig.port, () => {
  logger.info(
    `Server is running on port ${appConfig.port} in ${appConfig.nodeEnv} mode`,
  );
});

// -----------------------------------------------------------------------------
// Shutdown State
// -----------------------------------------------------------------------------

/**
 * Guards against re-entrant shutdown — prevents duplicate
 * shutdown sequences when multiple signals arrive in quick
 * succession.
 */
let shuttingDown = false;

/**
 * Initiates a graceful shutdown: stops accepting new requests,
 * closes the vector-store connection, then exits the process.
 *
 * @param {string} signal - The OS signal that triggered shutdown.
 * @returns {Promise<void>}
 */
const shutdown = async (signal) => {
  // Prevent duplicate shutdown attempts from stacked signals.
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info(`${signal} received. Shutting down...`);

  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      const provider = await closeVectorStore();
      logger.info('Closing vector store...');
      await provider.close();
      logger.info('Vector store closed.');
    } catch (err) {
      logger.error(err);
    }

    process.exit(0);
  });
};

// -----------------------------------------------------------------------------
// Signal Handlers
// -----------------------------------------------------------------------------

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
/**
 * -----------------------------------------------------------------------------
 * File: src/server/app.js
 *
 * Assembles the Express application — configures middleware
 * stack and mounts API routes.
 *
 * Responsibilities:
 * - Apply security, parsing, and logging middleware.
 * - Mount REST routes under the /api prefix.
 * - Attach fallback and global error handlers.
 * -----------------------------------------------------------------------------
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Routes from './routes/index.routes.js';
import middlewares from './middleware/index.js';
import logger from '../config/logger.config.js';

const app = express();

// -----------------------------------------------------------------------------
// Security Middleware
// -----------------------------------------------------------------------------

// Set security-related HTTP headers.
app.use(helmet());

// Allow cross-origin requests.
app.use(cors());

// -----------------------------------------------------------------------------
// Request Logging
// -----------------------------------------------------------------------------

// Log HTTP requests in 'combined' format through the application logger.
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// -----------------------------------------------------------------------------
// Body Parsing
// -----------------------------------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------

app.use('/api', Routes);

// -----------------------------------------------------------------------------
// Fallback Handlers
// -----------------------------------------------------------------------------

// Catch-all for unmatched routes.
app.use(middlewares.notFoundMiddleware);

// Global error handler — catches errors thrown from route handlers.
app.use(middlewares.errorMiddleware);

export default app;
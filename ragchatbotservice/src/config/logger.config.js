/**
 * -----------------------------------------------------------------------------
 * File: src/config/logger.config.js
 *
 * Configures a Winston logger with daily-rotating file and
 * console transports.
 *
 * Responsibilities:
 * - Persist application logs to rotating files under logs/.
 * - Write errors to a separate error-*.log file.
 * - Provide colourised console output for development.
 * -----------------------------------------------------------------------------
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { appConfig } from '../config/app.config.js';

const LOG_DIR = path.resolve('logs');

// -----------------------------------------------------------------------------
// Transports
// -----------------------------------------------------------------------------

const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss',
  }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  }),
);

/**
 * Winston logger instance with three transports:
 *  - Rotating application log (all levels)
 *  - Rotating error log (error level only)
 *  - Console log (colourised)
 *
 * exitOnError is disabled so a logger failure does not
 * crash the process.
 */
const logger = winston.createLogger({
  level: appConfig.logger.level,

  transports: [
    new DailyRotateFile({
      dirname: path.join(LOG_DIR, '%DATE%'),
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat,
    }),

    new DailyRotateFile({
      dirname: path.join(LOG_DIR, '%DATE%'),
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d',
      level: 'error',
      format: fileFormat,
    }),

    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],

  // Prevent a logger crash from taking down the application.
  exitOnError: false,
});

export default logger;
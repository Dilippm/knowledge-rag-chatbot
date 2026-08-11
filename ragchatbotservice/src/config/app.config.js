/**
 * -----------------------------------------------------------------------------
 * File: src/config/app.config.js
 *
 * Aggregates all environment-variable-driven configuration into a
 * single exported object for the rest of the application.
 *
 * Responsibilities:
 * - Load environment variables with dotenv.
 * - Expose port, Node environment, and provider flags.
 * - Group Azure, logger, and vector-store sub-configurations.
 * -----------------------------------------------------------------------------
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * Application-wide configuration object, populated from environment
 * variables. Each consumer imports only the slice it needs.
 */
export const appConfig = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  llmProvider: process.env.LLM_PROVIDER,

  azure: {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion: process.env.OPENAI_API_VERSION,
    deployment: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    embeddingDeployment: process.env.AZURE_OPENAI_EMBEDDING_API_DEPLOYMENT_NAME,
    instanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  },

  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
  vectorStore: {
    provider: process.env.VECTOR_STORE_PROVIDER,
    pgvector: {
      databaseUrl: process.env.DATABASE_URL,
      dbPoolMax: process.env.DB_POOL_MAX,
    },
  },
  client:{
    url: process.env.CLIENT_URL,
  },
  redis:{
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB ?? 0),
  }
};
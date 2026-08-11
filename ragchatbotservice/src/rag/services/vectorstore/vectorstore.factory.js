/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/vectorstore/vectorstore.factory.js
 *
 * Resolves the active vector-store provider by name
 * and validates its contract.
 *
 * Responsibilities:
 * - Map provider name to its adapter module.
 * - Validate the adapter against the contract.
 * - Initialise and return the provider.
 * -----------------------------------------------------------------------------
 */

import { appConfig } from '../../../config/app.config.js';
import * as pgVectorProvider from './providers/pgvector/pgvector.provider.js';
import { validateVectorStore } from './vectorstore.contract.js';

const providers = {
  pgvector: pgVectorProvider,
};

async function getProvider() {
  const provider = appConfig.vectorStore.provider.toLowerCase() || 'pgvector';

  const adapter = providers[provider];

  if (!adapter) {
    throw new Error(`Unsupported vector store: ${provider}`);
  }

  validateVectorStore(adapter);

  await adapter.initialize();

  return adapter;
}

export async function getVectorStoreProvider() {
  return getProvider();
}

export async function getVectorStore() {
  const provider = await getProvider();

  return provider.getVectorStore();
}

export async function closeVectorStore() {
  const provider = appConfig.vectorStore.provider.toLowerCase() || 'pgvector';

  const adapter = providers[provider];

  if (!adapter) {
    throw new Error(`Unsupported vector store: ${provider}`);
  }

  validateVectorStore(adapter);

  return adapter;
}
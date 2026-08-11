/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/llm/llm.factory.js
 *
 * Creates an LLM instance based on the configured
 * provider (e.g. Azure).
 *
 * Responsibilities:
 * - Resolve the provider from app config.
 * - Return the matching model instance.
 * -----------------------------------------------------------------------------
 */

import { appConfig } from '../../../config/app.config.js';
import { azureModel } from './providers/azure.provider.js';

export function createLLM() {
  switch (appConfig.llmProvider) {
    case 'azure':
      return azureModel;

    default:
      throw new Error('Unsupported provider');
  }
}
/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/embeddings/embedding.service.js
 *
 * Azure OpenAI embedding service — generates vector
 * embeddings for text content.
 *
 * Responsibilities:
 * - Create an AzureOpenAIEmbeddings client.
 * - Provide a single `generateEmbedding` function.
 * - Export the client instance for direct use.
 * -----------------------------------------------------------------------------
 */

import { AzureOpenAIEmbeddings } from '@langchain/openai';
import { azureConfig } from '../../../config/azure.config.js';

const embeddingService = new AzureOpenAIEmbeddings({
  azureOpenAIApiKey: azureConfig.apiKey,
  azureOpenAIApiEmbeddingsDeploymentName: azureConfig.embeddingDeployment,
  azureOpenAIApiVersion: azureConfig.apiVersion,
  azureOpenAIApiInstanceName: azureConfig.instanceName,
  maxRetries: 3,
});

/**
 * Generates an embedding vector for a single text string.
 *
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} The embedding vector.
 */
export async function generateEmbedding(text) {
  return embeddingService.embedQuery(text);
}

export default embeddingService;
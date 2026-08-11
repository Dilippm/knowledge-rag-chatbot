/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/llm/providers/azure.provider.js
 *
 * Azure ChatOpenAI model singleton — uses the Azure
 * configuration for API key, endpoint, and deployment.
 *
 * Responsibilities:
 * - Create a zero-temperature Azure ChatOpenAI instance.
 * -----------------------------------------------------------------------------
 */

import { AzureChatOpenAI } from '@langchain/openai';
import { azureConfig } from '../../../../config/azure.config.js';

export const azureModel = new AzureChatOpenAI({
  azureOpenAIApiKey: azureConfig.apiKey,
  azureOpenAIApiInstanceName: azureConfig.instanceName,
  azureOpenAIApiDeploymentName: azureConfig.deployment,
  azureOpenAIApiVersion: azureConfig.apiVersion,
  temperature: 0,
});
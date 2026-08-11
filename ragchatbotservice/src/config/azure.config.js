/**
 * -----------------------------------------------------------------------------
 * File: src/config/azure.config.js
 *
 * Extracts the Azure-specific configuration slice from the
 * main app config.
 *
 * Responsibilities:
 * - Provide a focused reference to Azure OpenAI settings.
 * -----------------------------------------------------------------------------
 */

import { appConfig } from './app.config.js';

/**
 * Azure OpenAI endpoint, credentials, and deployment identifiers.
 */
export const azureConfig = appConfig.azure;
/**
 * -----------------------------------------------------------------------------
 * File: src/rag/test/verify.llm.js
 *
 * Connection test — sends a sample query to the LLM
 * and logs the response.
 * -----------------------------------------------------------------------------
 */

import { chatService } from '../services/chat/chat.service.js';

async function verifyConnection() {
  try {
    const response = await chatService('What is LangChain?');

    console.log(response);
  } catch (error) {
    console.error('Connection Failed');
    console.error(error.message);
  }
}

verifyConnection();
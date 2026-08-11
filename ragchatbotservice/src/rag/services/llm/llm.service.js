/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/llm/llm.service.js
 *
 * Wraps the LLM with common invocation helpers —
 * invoke, stream, structured output.
 *
 * Responsibilities:
 * - Provide a single `getModel()` accessor.
 * - Expose invoke/stream/invokeStructured helpers.
 * -----------------------------------------------------------------------------
 */

import { createLLM } from './llm.factory.js';

const model = createLLM();

export async function invoke(prompt) {
  return model.invoke(prompt);
}

export async function stream(prompt) {
  return model.stream(prompt);
}

export async function invokeStructured(prompt, schema) {
  return model.withStructuredOutput(schema).invoke(prompt);
}

export function getModel() {
  return model;
}
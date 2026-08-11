/**
 * -----------------------------------------------------------------------------
 * File: src/rag/schemas/ragResponse.schema.js
 *
 * Zod schema defining the structure of a RAG response.
 *
 * Responsibilities:
 * - Enforce the shape of LLM output (answer + confidence).
 * - Provide a type-safe contract for downstream consumers.
 * -----------------------------------------------------------------------------
 */

import { z } from 'zod';

/**
 * Schema for RAG responses.
 *
 * Validates that every response includes:
 * - answer: string
 * - confidence: "high" | "medium" | "low"
 */
export const RagResponseSchema = z.object({
  answer: z.string().describe("Answer to the user's question."),
  confidence: z
    .enum(['high', 'medium', 'low'])
    .describe('Confidence level based on the retrieved context.'),
});
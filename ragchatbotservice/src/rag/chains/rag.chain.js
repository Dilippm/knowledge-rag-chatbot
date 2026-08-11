/**
 * -----------------------------------------------------------------------------
 * File: src/rag/chains/rag.chain.js
 *
 * Full RAG pipeline: retrieval, guardrail branching,
 * prompt generation, and response assembly.
 *
 * Responsibilities:
 * - Retrieve documents via vector-store retriever.
 * - Validate input through guardrails (greeting, instruction,
 *   empty-question, no-documents).
 * - Build context, generate answer, and merge with source metadata.
 * -----------------------------------------------------------------------------
 */

import {
  RunnableLambda,
  RunnablePassthrough,
  RunnableSequence,
  RunnableBranch,
} from '@langchain/core/runnables';

import { buildContext } from '../builders/contextBuilder.js';
import { ragPrompt } from '../prompts/rag.prompt.js';
import { getRetriever } from '../services/retriever/vectostore.retriever.js';
import * as llmService from '../services/llm/llm.service.js';
import { RagResponseSchema } from '../schemas/ragResponse.schema.js';
import {
  invalidQuestionResponse,
  isInvalidQuestion,
} from '../guards/question.guard.js';
import { greetingResponse, isGreeting } from '../guards/greeting.guard.js';
import {
  hasNoDocuments,
  noDocumentsResponse,
} from '../guards/noDocuments.guard.js';
import {
  instructionAttackResponse,
  isInstructionAttack,
} from '../guards/instruction.guard.js';

/**
 * LLM with structured output validation
 */
const model = llmService.getModel().withStructuredOutput(RagResponseSchema);

/**
 * Build prompt variables
 */
const buildPromptInput = RunnableLambda.from((input) => ({
  question: input.question,
  context: buildContext(input.documents),
  summary: input.summary ?? "",

  history: input.history ?? "",
}));

/**
 * Merge answer with retrieved source metadata
 */
const mergeAnswer = RunnableLambda.from((input) => ({
  success: true,

  answer: input.answer.answer,

  confidence: input.answer.confidence,

  sources: input.documents.map((doc) => ({
    source: doc.metadata.source,
    chunk: doc.metadata.chunk,
  })),
}));

/**
 * Main RAG pipeline
 */
// const retrieveDocuments = RunnableLambda.from(async (question) => {
//   const retriever = await getRetriever();
//   return retriever.invoke(question);
// });

const retrieveDocuments = RunnableLambda.from(async (input) => {
  const retriever = await getRetriever();

  return retriever.invoke(input.question);
});

// const retrievalPipeline = RunnableSequence.from([
//   {
//     question: new RunnablePassthrough(),
//     documents: retrieveDocuments,
//   },
//   RunnableLambda.from((input) => input),
// ]);

const retrievalPipeline = RunnableLambda.from(async (input) => {
  const retriever = await getRetriever();

  const documents = await retriever.invoke(input.question);

  return {
    ...input,
    documents,
  };
});

// const generationPipeline = RunnableSequence.from([
//   {
//     documents: new RunnablePassthrough().pick('documents'),

//     answer: RunnableSequence.from([buildPromptInput, ragPrompt, model]),
//   },

//   mergeAnswer,
// ]);

// /**
//  * RAG Chain with Guardrails
//  */

const generationPipeline = RunnableSequence.from([
  RunnableLambda.from((input) => ({
    documents: input.documents,

    answerInput: input,
  })),

  {
    documents: new RunnablePassthrough().pick("documents"),

    answer: RunnableSequence.from([
      RunnableLambda.from((input) => input.answerInput),
      buildPromptInput,
      ragPrompt,
      model,
    ]),
  },

  mergeAnswer,
]);
const generationBranch = RunnableBranch.from([
  [hasNoDocuments, noDocumentsResponse],

  generationPipeline,
]);

export const ragChain = RunnableBranch.from([
  [isInvalidQuestion, invalidQuestionResponse],
  [isGreeting, greetingResponse],

  [isInstructionAttack, instructionAttackResponse],
  RunnableSequence.from([retrievalPipeline, generationBranch]),
]);
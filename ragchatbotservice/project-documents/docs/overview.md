# System Overview

The Enterprise RAG Chatbot Backend is a document-grounded question-answering system built on a Retrieval-Augmented Generation (RAG) architecture. It ingests project documentation, converts them into vector embeddings, stores them in a PostgreSQL-backed PGVector store, and answers user queries by retrieving relevant document chunks before passing them through a structured Azure OpenAI pipeline.

The system exists to provide accurate, context-bound answers over internal enterprise knowledge bases. By grounding every response in retrieved documents, it eliminates the need for an LLM to rely on its own training data, reducing hallucination risk and keeping answers scoped to the content the organisation controls.

## Business Objectives

- Provide accurate, document-grounded answers to user questions.
- Reduce LLM hallucination by enforcing context-only responses.
- Enable enterprise-wide knowledge retrieval from a centralised document corpus.
- Expose RAG capabilities through a simple REST API for integration with front-end chat applications.

## Core Capabilities

| Capability | Description |
|------------|-------------|
| Document Ingestion | Imports markdown, PDF, and text files from a project directory and splits them into chunks. |
| Embedding Generation | Converts document chunks into vector embeddings via Azure OpenAI. |
| Semantic Retrieval | Finds the most relevant document chunks for a given query using cosine similarity. |
| AI Response Generation | Produces a structured answer from the retrieved context using a LangChain RAG pipeline. |
| Input Guardrails | Detects and rejects empty questions, instruction-manipulation attempts, and greeting patterns. |
| Enterprise Logging | Persists application and error logs to daily-rotating files. |

## System Components

- **Express Server** — Boots the HTTP server on the configured port and registers OS signal handlers for graceful shutdown.
- **REST API Layer** — Express routes mounted under `/api/chat`, `/api/ingestion`, and `/api/health`.
- **RAG Engine** — LangChain runnable sequence that combines retrieval, prompt construction, guardrail branching, and LLM invocation.
- **Embedding Service** — Azure OpenAI client that generates vector embeddings from document page content.
- **Retrieval Service** — Wraps the PGVector store as a LangChain retriever with configurable top-K.
- **Vector Store** — PostgreSQL-backed PGVector instance with a `documents` table storing id, content, metadata, and embedding columns.
- **Prompt Builder** — Assembles the RAG prompt by combining the user question with the formatted context.
- **Guardrails** — RunnableLambda-based filters that short-circuit the pipeline for invalid input (no documents, empty question, instruction attack, or greetings).
- **Logging** — Winston logger with daily-rotating file transports for application and error logs.

## High-Level Workflow

1. A user question arrives .
2. The request passes through route-level validation (express-validator).
3. If validation fails, the middleware forwards a 400 error to the global handler.
4. The question enters the RAG pipeline:
   - Guardrails check for empty questions, greetings, instruction-manipulation patterns.
   - If no documents exist for the query, the pipeline returns a "no information" response.
   - Otherwise, documents are retrieved from the vector store via cosine similarity search.
5. The retrieved context is formatted into a structured prompt with system instructions.
6. The prompt is sent to Azure OpenAI, which returns a structured answer with a confidence score.
7. The response is returned to the client as JSON with source metadata and response-time metrics.


## System Characteristics

- **Modular architecture** — Each stage of the RAG pipeline is isolated into its own service and composed via LangChain runnables.
- **Provider-based vector store** — The vector store is resolved by name and validated against a contract, enabling future provider swaps without changing the pipeline.
- **Enterprise logging** — Separate rotating files for application and error logs, with colourised console output in development.
- **Structured responses** — All API responses follow a consistent `{ success, data/message }` envelope.
- **Separation of concerns** — Controllers delegate to services; services delegate to chains; chains compose runnables.
- **Graceful shutdown** — SIGINT / SIGTERM handlers drain active connections and release vector-store resources before exiting.

## Current Scope

The current implementation supports single-shot document ingestion from a local directory, embedding generation for new documents only (skipping duplicates), and question answering over the ingested corpus. All responses are synchronous, stateless, and scoped to the provided context. The system does not retain conversation history or support streaming responses.

## Future Enhancements

- Socket.IO integration for real-time chat
- Conversation memory and session management
- User authentication and request authorisation
- Streaming token-by-token responses
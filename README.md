# RAG Chatbot

![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![LLM](https://img.shields.io/badge/LLM-Powered-6B46C1)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PGVector-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker_Compose-Ready-2496ED?logo=docker&logoColor=white)

A full-stack, document-grounded chatbot for asking questions over a private knowledge base. The application retrieves relevant document chunks from PostgreSQL/PGVector and uses LLM to generate an answer constrained by that context.

It includes a React chat interface, an Express API, a Socket.IO chat channel, Redis-backed conversation memory, and a containerised local-development stack.

## Contents

- [Architecture](#architecture)
- [Observability](#observability)
- [Features](#features)
- [Technology](#technology)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Using the application](#using-the-application)
- [API reference](#api-reference)
- [Socket.IO events](#socketio-events)
- [Project structure](#project-structure)
- [Development commands](#development-commands)
- [Troubleshooting](#troubleshooting)

## Architecture

```text
React + Vite frontend
        │
        │ REST API / Socket.IO
        ▼
Express API + Socket.IO
        │
        ├───────────────► Redis
        │                 Conversation memory
        │
        ▼
LangChain RAG pipeline
Guards → retrieval → prompt → structured response
        │
        ├───────────────► PostgreSQL + PGVector
        │                 Document embeddings and similarity search
        │
        ├───────────────► LLM
        │                 Embeddings and answer generation
        │
        └───────────────► Observability
                          Langfuse CallbackHandler + OpenTelemetry
                                      │
                                      ▼
                          Self-hosted Langfuse
                          traces, nested observations, and generations
```

For a question, the service validates the input, applies lightweight guards for invalid input, greetings, prompt-injection patterns, and missing context, retrieves the most relevant chunks, builds a prompt with the retrieved context and recent conversation history, and returns a structured answer with a confidence level and source metadata.

## Observability

Langfuse provides observability for the RAG pipeline. The integration is composed of two cooperating layers:

- `src/rag/services/rag/responseGenerator.rag.js` creates a Langfuse `CallbackHandler` and passes it to every `ragChain.invoke()` call. This records the LangChain execution, including the RAG runnable flow and LLM generation.
- `src/server/services/instrumentation.service.js` starts an OpenTelemetry `NodeSDK` with `LangfuseSpanProcessor`. The processor exports compatible OpenTelemetry spans to Langfuse.

```text
Chat request
    │
    ▼
responseGenerator.generateResponse()
    │
    ├── CallbackHandler ──► ragChain.invoke()
    │                         guards → retrieval → prompt → LLM → structured response
    │                                      │
    │                                      ▼
    │                         Langfuse trace with nested observations
    │
    └── NodeSDK + LangfuseSpanProcessor ──► exports OpenTelemetry spans
                                               │
                                               ▼
                                      Self-hosted Langfuse UI
```

The self-hosted Langfuse service is defined in `docker-compose.yml`. `langfuse-web` and `langfuse-worker` use dedicated PostgreSQL, ClickHouse, Redis, and MinIO services; the UI is available at `http://localhost:3000`.

Set the following backend variables in `ragchatbotservice/.env`. Create the public and secret keys in the Langfuse project, and use the Compose service hostname from inside the backend container.

```env
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=http://langfuse-web:3000
```

Langfuse can then be used to inspect each instrumented RAG execution, its nested operations, inputs and outputs, generation metadata, latency, token usage when supplied by the model integration, and failures reported by the traced call.

## Features

- Document ingestion from `ragchatbotservice/data/documents/<project-name>/`.
- Text chunking  and LLM embeddings.
- Semantic similarity search using PGVector cosine distance.
- Context-grounded, structured answers with `high`, `medium`, or `low` confidence.
- REST endpoints for health checks, document ingestion, RAG chat, and a simple chat test.
- Socket.IO chat with JWT authentication, typing state, and session termination.
- Redis-backed conversation history with automatic summarisation and a 30-minute session expiry.
- Responsive React chat UI with Markdown rendering, copying, clear-chat, and request error handling.
- Security headers, CORS, request logging, rotating application/error logs, and graceful shutdown.
- Self-hosted Langfuse observability for instrumented LangChain RAG executions and OpenTelemetry spans.

## Technology

| Area | Implementation |
| --- | --- |
| Frontend | React 18, Vite, Axios, React Markdown |
| API | Node.js, Express 5, Socket.IO |
| RAG orchestration | LangChain, Zod structured output |
| AI provider | Configurable LLM for chat and embedding generation |
| Vector database | PostgreSQL 16 with PGVector |
| Session store | Redis 7 |
| Observability | Langfuse, `@langfuse/langchain`, OpenTelemetry NodeSDK, `LangfuseSpanProcessor` |
| Operations | Docker Compose, Winston, Morgan, Helmet |

## Quick start

### Prerequisites

- Docker Engine with Docker Compose
- LLM provider endpoint, API key, chat deployment, and embedding deployment

For running the frontend outside Docker, also install Node.js 22+ and npm.

### 1. Configure the backend

The Compose service loads `ragchatbotservice/.env`. Copy the template and set the required values:

```bash
cd ragchatbotservice
cp .env.example .env
```

### 2. Start the backend services

From the repository root:

```bash
docker compose up --build -d
```

Run the database migration once the PostgreSQL container is healthy:

```bash
docker compose exec ragchatbotservice npm run db-migrate
```

The API is available at `http://localhost:4321/api`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Configuration

### Backend environment variables

Keep `.env` files private. They contain credentials and are intentionally ignored by Git.

## Using the application

### Add knowledge-base documents

Create a folder named for your project under the backend's document directory and add the files to ingest:

```text
ragchatbotservice/
└── data/
    └── documents/
        └── my-project/
            ├── handbook.md
            └── release-notes.txt
```

The current loader passes each file through LangChain's text loader, so use text-based documents such as Markdown and plain text. The job processes the directory, chunks the contents, creates embeddings, upserts them into the `documents` table, and removes its temporary processed/embedding files after indexing.

### Trigger ingestion

```bash
curl -X POST http://localhost:4321/api/ingestion \
  -H 'Content-Type: application/json' \
  -d '{"projectName":"my-project"}'
```

The endpoint returns `202 Accepted` immediately; processing continues in the background. Follow the service logs to monitor it:

```bash
docker compose logs -f ragchatbotservice
```

### Ask a question

```bash
curl -X POST http://localhost:4321/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"What does the handbook say about releases?"}'
```

## API reference

All REST endpoints are prefixed with `/api`.

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | — | Returns the service health status. |
| `POST` | `/chat` | `{ "question": "..." }` | Runs the RAG question-answering flow. Questions must be 2–1,000 characters. |
| `POST` | `/chat/test` | `{ "message": "..." }` | Calls the basic chat chain without document retrieval. |
| `POST` | `/ingestion` | `{ "projectName": "..." }` | Starts background ingestion for `data/documents/<projectName>`. |

Example RAG response:

```json
{
  "success": true,
  "data": {
    "success": true,
    "data": {
      "answer": "...",
      "confidence": "high",
      "sources": ["handbook.md"],
      "metadata": {
        "responseTime": 418
      }
    }
  }
}
```

## Socket.IO events

The service accepts Socket.IO connections on the same port as the REST API. Clients must supply a JWT in `auth.token` or a `Bearer` authorization header; its payload must provide `sub`, `sessionId`, and `role` claims.

| Direction | Event | Payload |
| --- | --- | --- |
| Server → client | `chat:connected` | `{ success, socketId, message }` |
| Client → server | `chat:message` | `{ message }` |
| Server → client | `chat:typing` | `{ typing }` |
| Server → client | `chat:response` | `{ success, answer }` |
| Server → client | `chat:error` | `{ success: false, message }` |
| Client → server | `chat:terminate` | No payload; deletes the current conversation. |
| Server → client | `chat:terminated` | `{ success: true }` |

## Project structure

```text
.
├── docker-compose.yml              # Application services and self-hosted Langfuse stack
├── frontend/                       # React/Vite chat client
│   ├── src/components/             # Chat UI components
│   ├── src/hooks/useChat.js        # Client-side chat state and requests
│   └── src/services/api.js         # REST client
├── ragchatbotservice/              # Express, Socket.IO, and RAG backend
│   ├── src/config/                 # Environment-driven configuration
│   ├── src/database/               # PGVector migration
│   ├── src/rag/                    # Chains, prompts, guards, providers, memory
│   ├── src/server/                 # Routes, controllers, jobs, sockets, instrumentation
│   │   └── services/instrumentation.service.js # OpenTelemetry + Langfuse span processor
│   ├── data/documents/             # Knowledge-base source documents
│   └── project-documents/docs/     # Detailed technical documentation
└── storage/                        # Local container persistence and logs
```

## Development commands

Run these commands from the indicated directory.

| Directory | Command | Purpose |
| --- | --- | --- |
| `ragchatbotservice` | `npm install` | Install backend dependencies. |
| `ragchatbotservice` | `npm run dev` | Start the backend with Nodemon. |
| `ragchatbotservice` | `npm start` | Start the backend normally. |
| `ragchatbotservice` | `npm run db-migrate` | Create the PGVector extension, documents table, and HNSW index. |
| `ragchatbotservice` | `npm run lint` | Lint backend source. |
| `ragchatbotservice` | `npm run format:check` | Check backend formatting. |
| `frontend` | `npm install` | Install frontend dependencies. |
| `frontend` | `npm run dev` | Start the Vite development server. |
| `frontend` | `npm run build` | Build the production frontend bundle. |
| `frontend` | `npm run preview` | Preview the production frontend build. |

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `Table 'documents' does not exist` | Run `docker compose exec ragchatbotservice npm run db-migrate`. |
| API cannot connect to PostgreSQL | Verify `DATABASE_URL`; use `postgres:5432` from the backend container and `localhost:5434` from the host. |
| Chat returns no useful document context | Add documents under the selected project folder and call `/api/ingestion` before chatting. |
| Frontend cannot reach the API | Ensure the backend is running and `VITE_API_URL=http://localhost:4321/api`, then restart Vite. |
| Socket connection is rejected | Provide a valid JWT and configure the same `JWT_SECRET` used to sign it. |
| Ingestion fails | Confirm the project folder exists and review `docker compose logs -f ragchatbotservice`. |

## Further documentation

Backend implementation notes and design references are available in [the backend documentation](ragchatbotservice/project-documents/docs/README.md).

# Enterprise RAG Chatbot Backend

## Overview

The Enterprise RAG Chatbot Backend is a Retrieval-Augmented Generation (RAG) application that enables users to ask natural language questions over an enterprise knowledge base. The system retrieves relevant document context from a vector database and generates grounded responses using Azure OpenAI.

This repository contains the backend services responsible for document ingestion, embedding generation, semantic retrieval, and REST API endpoints that power the chatbot application.


## Key Features

- Enterprise Retrieval-Augmented Generation (RAG)
- Document ingestion and processing
- Azure OpenAI embedding generation
- Semantic search using PostgreSQL + PGVector
- REST APIs for chat, ingestion, and health monitoring
- Input validation and guardrails
- Enterprise logging and graceful shutdown

## Technology Stack

| Layer             | Technology               |
|-------------------|--------------------------|
| Runtime           | Node.js                  |
| Framework         | Express                  |
| AI Platform       | Azure OpenAI             |
| RAG Framework     | LangChain                |
| Database          | PostgreSQL               |
| Vector Store      | PGVector                 |
| Validation        | express-validator, Zod   |
| Logging           | Winston                  |
| Security          | Helmet, CORS             |

---

## Project Structure

```text
src/
├── config/          Application configuration
├── constants/       Shared constants
├── server/          HTTP server and REST API layer
├── rag/             Retrieval-Augmented Generation engine
├── database/        Database migrations and initialization

docs/                Technical documentation
data/                Knowledge base and generated artifacts
logs/                Application logs
```



## Documentation Guide

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project landing page (this file) |
| [overview.md](overview.md) | System overview |
| [setup.md](setup.md) | Development environment setup |
| [architecture.md](architecture.md) | High-level system architecture |
| [backend-reference.md](backend-reference.md) | Backend implementation reference |
| [backend-api-reference.md](backend-api-reference.md) | REST API documentation |
| [operations.md](operations.md) | Operations and maintenance guide |
| [coding-guidelines.md](CODING-GUIDELINES.md) | Coding standards and review checklist |
| [DOCUMENTAION-GUIDELINES.md](DOCUMENTAION-GUIDELINES.md) | Documentation guidelines |


All source files are documented with file-level headers and JSDoc following the project's documentation guidelines.

## Getting Started

For new developers, the recommended reading order is:

1. `docs/README.md` — This document
2. `docs/overview.md` — System overview


## Contributing

All contributions must adhere to:

- The project's coding standards (ESLint + Prettier)
- The documentation guidelines defined in `docs/DOCUMENTAION-GUIDELINES.md`
- JSDoc and file-level headers for every new file
- Existing naming conventions and code style

## License

This repository is intended for internal enterprise use and is not licensed for public distribution.
# Backend API Reference

## Purpose

This document describes all backend APIs exposed by the RAG Chatbot Backend.

It is intended for:

- Frontend Developers
- Backend Developers
- QA Engineers
- DevOps Engineers
- Future Maintainers

**Base URL:**

```text
http://localhost:4321
```

---

# Chat APIs

## Chat Test

### Endpoint

```http
POST /api/chat/test
```

### Description

Sends a message to the simple chat pipeline (bypasses the full RAG pipeline). Used for testing the LLM connection without document retrieval.

### Authentication

Not Required

### Request

```json
{
  "message": "explain RAG in 20 words"
}
```

### Response

```json
{
  "success": true,
  "answer": "RAG (Retrieval-Augmented Generation) combines information retrieval with generative AI, enabling models to generate responses using external, relevant data sources."
}
```

### Success Code

```http
200 OK
```

---

## RAG Chat

### Endpoint

```http
POST /api/chat
```

### Description

Runs the full RAG pipeline — retrieves relevant documents from the vector store, constructs a context-grounded prompt, sends it to Azure OpenAI, and returns a structured response with source metadata.

### Authentication

Not Required

### Request

```json
{
  "question": "How does the inspection pipeline work?"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "success": true,
    "data": {
      "answer": "<Answer text>",
      "confidence": "high",
      "sources": ["inspection_pipeline.md", "index.md"],
      "metadata": {
        "responseTime": 4149
      }
    }
  }
}
```

### Success Code

```http
200 OK
```

---

# Ingestion APIs

## Document Ingestion

### Endpoint

```http
POST /api/ingestion
```

### Description

Initiates document ingestion for a project. Loads files from the project directory, splits them into chunks, normalises metadata, and generates embeddings.

### Authentication

Not Required

### Request

```json
{
  "projectName": "cts"
}
```

### Response

```json
{
  "success": true,
  "message": "Ingestion completed successfully"
}
```

### Success Code

```http
202 Accepted
```

---

# Health APIs

## Health Check

### Endpoint

```http
GET /api/health
```

### Description

Returns the current server health status.

### Authentication

Not Required

### Response

```json
{
  "success": true,
  "message": "Server is running."
}
```

### Success Code

```http
200 OK
```

---

# Common HTTP Status Codes

| Status | Meaning             |
| ------ | ------------------- |
| 200    | Success             |
| 202    | Accepted            |
| 400    | Validation Error    |
| 404    | Not Found           |
| 500    | Internal Server Error |

---

# API Groups Summary

| Group       | Description                                   |
| ----------- | --------------------------------------------- |
| Chat        | Simple and RAG-powered chat endpoints         |
| Ingestion   | Document ingestion and embedding generation   |
| Health      | Service monitoring and health check           |

---

# Available Variables

| Variable   | Value                |
| ---------- | -------------------- |
| base_url   | http://localhost:4321 |
# Setup Guide

## Purpose

This document describes how to configure, deploy, and run the Enterprise RAG Chatbot Backend for local development and testing.

It covers:

- System requirements
- Repository setup
- Environment configuration
- Docker setup
- Manual setup
- Database initialization
- Knowledge base setup
- Application startup
- Verification
- Troubleshooting

Docker Compose is the **recommended** approach for local development, while manual setup remains available for debugging and advanced development scenarios.

---

# System Requirements

| Component | Version / Requirement |
|-----------|----------------------|
| Ubuntu | 22.04+ |
| Docker | Latest |
| Docker Compose | Latest |
| Node.js | 22.x (Manual setup only) |
| npm | 10.x+ (Manual setup only) |
| Git | Latest |

---

# Repository Setup

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project root:

```bash
cd ragchatbotservice
```

If running without Docker, install dependencies:

```bash
npm install
```

---

# Project Structure

```text
.env.example      Environment variable template
.env              Local environment configuration

Dockerfile        Backend container image
docker-compose.yml Docker Compose configuration

src/              Application source code
docs/             Project documentation
data/             Documents, processed files, and embeddings
logs/             Application logs
storage/          Persistent PostgreSQL data
```

---

# Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Populate the required environment variables.

---

## Server Configuration

| Variable | Description |
|----------|-------------|
| PORT | HTTP server port |
| NODE_ENV | Application environment |
| LLM_PROVIDER | LLM provider name |

---

## Azure OpenAI

| Variable | Description |
|----------|-------------|
| AZURE_OPENAI_API_KEY | Azure OpenAI API key |
| AZURE_OPENAI_ENDPOINT | Azure OpenAI endpoint |
| OPENAI_API_VERSION | Azure OpenAI API version |
| AZURE_OPENAI_API_DEPLOYMENT_NAME | Chat model deployment |
| AZURE_OPENAI_EMBEDDING_API_DEPLOYMENT_NAME | Embedding deployment |
| AZURE_OPENAI_API_INSTANCE_NAME | Azure OpenAI instance |

---

## Logging

| Variable | Description |
|----------|-------------|
| LOG_LEVEL | Application log level |

---

## Vector Store

| Variable | Description |
|----------|-------------|
| VECTOR_STORE_PROVIDER | Vector store provider |
| DATABASE_URL | PostgreSQL connection string |
| DB_POOL_MAX | Maximum database pool size |

---

## PostgreSQL

| Variable | Description |
|----------|-------------|
| POSTGRES_USER | PostgreSQL username |
| POSTGRES_PASSWORD | PostgreSQL password |
| POSTGRES_DB | Database name |

---

# Docker Setup (Recommended)

Docker Compose automatically starts:

- Enterprise RAG Chatbot Backend
- PostgreSQL
- PGVector Extension

Build and start the application:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f
```

Stop the services:

```bash
docker compose down
```

Stop and remove persistent volumes:

```bash
docker compose down -v
```

The backend will be available at:

```text
http://localhost:4321
```

---

# Database Setup

## Docker (Recommended)

Docker Compose provisions PostgreSQL with the PGVector extension.

Once the containers are running, initialize the schema:

```bash
docker compose exec ragchatbot npm run db-migrate
```

The migration creates the required database tables.

---

## Manual Setup

If Docker is not being used:

1. Install PostgreSQL 16+.
2. Install the PGVector extension.

```sql
CREATE EXTENSION vector;
```

3. Create the application database.
4. Configure `DATABASE_URL` inside `.env`.
5. Execute the migration:

```bash
npm run db-migrate
```

---

# Knowledge Base Setup

Place your project documents inside:

```text
data/documents/<project-name>/
```

Supported document types include:

- Markdown (`.md`)
- PDF (`.pdf`)
- Text (`.txt`)
- JSON (`.json`)

Each project should maintain its own document directory.

---

# Starting the Application

## Option 1 — Docker Compose (Recommended)

Build and start the complete application stack:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

The application will be available at:

```text
http://localhost:4321
```

---

## Option 2 — Local Development

Install dependencies:

```bash
npm install
```

Ensure PostgreSQL is running.

Run database migrations:

```bash
npm run db-migrate
```

Start the application:

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Expected startup log:

```text
Server is running on port <PORT> in <NODE_ENV> mode
```

---

# Health Verification

Verify the backend:

```bash
curl http://localhost:4321/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running."
}
```

---

# Document Ingestion

Once documents have been placed inside the project directory, ingest them using:

```bash
curl -X POST http://localhost:4321/api/ingestion \
  -H "Content-Type: application/json" \
  -d '{
    "projectName":"<project-name>"
  }'
```

The ingestion pipeline will:

1. Load documents
2. Split documents into chunks
3. Generate embeddings
4. Store vectors in PostgreSQL (PGVector)

---

# Chat API Verification

Verify the complete RAG pipeline:

```bash
curl -X POST http://localhost:4321/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question":"How does the inspection pipeline work?"
  }'
```

Expected response:

```json
{
  "success": true,
  "data": {
    "answer": "...",
    "confidence": 0.95,
    "sources": []
  }
}
```

---

# Development Workflow

1. Clone the repository.
2. Copy `.env.example` to `.env`.
3. Configure all required environment variables.
4. Place project documents inside:

   ```text
   data/documents/<project-name>/
   ```

5. Start Docker Compose:

   ```bash
   docker compose up --build
   ```

6. Run database migrations (if required):

   ```bash
   docker compose exec ragchatbot npm run db-migrate
   ```

7. Verify the health endpoint.
8. Ingest project documents.
9. Test the Chat API.
10. Begin development.

---

# Verification Checklist

Before starting development verify:

- [ ] Docker is installed
- [ ] Docker Compose is installed
- [ ] `.env` has been configured
- [ ] Docker Compose starts successfully
- [ ] PostgreSQL container is healthy
- [ ] Backend container is running
- [ ] Database migration completed successfully
- [ ] Health endpoint returns HTTP 200
- [ ] Documents ingested successfully
- [ ] Embeddings generated successfully
- [ ] Chat endpoint returns valid responses

---

# Troubleshooting

## Missing Environment Variables

The application will fail to start if required environment variables are missing.

Verify:

- `.env` exists
- Azure OpenAI credentials are configured
- `DATABASE_URL` is valid

---

## Docker Build Failure

Rebuild without using cached layers:

```bash
docker compose build --no-cache
```

Review the build logs for dependency or configuration issues.

---

## Container Startup Failure

Check backend logs:

```bash
docker compose logs -f ragchatbot
```

Check PostgreSQL logs:

```bash
docker compose logs -f postgres
```

---

## Database Connection Failure

Ensure:

- PostgreSQL container is healthy.
- `DATABASE_URL` matches the database configuration.
- Database migrations have completed successfully.

---

## PGVector Extension Missing

The application requires the PGVector extension.

Verify:

```sql
CREATE EXTENSION vector;
```

If using Docker, this is already provided by the PGVector image.

---

## Azure OpenAI Configuration Issues

Verify:

- API Key
- Endpoint
- Deployment names
- API Version

Both the chat model and embedding model must be configured correctly.

---

## Port Already in Use

If port `4321` is already occupied, either:

- Stop the conflicting application.
- Update the port mapping in `docker-compose.yml`.
- Update the `PORT` environment variable.

---

## Embedding Generation Failures

Verify:

- Azure OpenAI credentials
- Embedding deployment
- Internet connectivity
- Request quotas

Transient failures are automatically retried according to the configured retry policy.

---

## Future Improvements

- Docker and Docker Compose for containerised development
- Socket.IO for real-time chat
- User authentication and request authorisation
- Conversation memory and session state


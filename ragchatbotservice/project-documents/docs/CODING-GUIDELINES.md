# Enterprise RAG Chatbot - Coding Standards & Development Guidelines

**Version:** 1.0
**Project:** Enterprise RAG Chatbot
**Language:** JavaScript (ES Modules)
**Framework:** Node.js + Express + LangChain

---

# 1. Purpose

This document defines the coding standards, naming conventions, folder organization, and development guidelines for the Enterprise RAG Chatbot project.

The primary goals are:

- Maintain consistency
- Improve readability
- Reduce technical debt
- Simplify maintenance
- Enable collaborative development

---

# 2. General Principles

Follow these principles throughout the project:

- Write clean and readable code.
- Prefer simplicity over cleverness.
- Keep files focused on a single responsibility.
- Avoid duplicate code (DRY).
- Follow modular design.
- Prefer composition over large monolithic files.
- Keep business logic separate from HTTP logic.

---

# 3. Folder Structure Rules

The project follows a feature-based modular architecture.

```text id="pwhjiq"
src/

config/
controllers/
routes/
services/
chains/
prompts/
middleware/
utils/
```

Each folder has a single responsibility.

| Folder      | Responsibility        |
| ----------- | --------------------- |
| config      | Configuration         |
| controllers | HTTP request handling |
| routes      | Express routes        |
| services    | Business logic        |
| chains      | LangChain pipelines   |
| prompts     | Prompt templates      |
| middleware  | Express middleware    |
| utils       | Helper functions      |

---

# 4. File Naming Convention

Use **kebab-case** for all files.

Examples

```text id="o3bctu"
chat.controller.js

chat.service.js

llm.service.js

error.middleware.js

chat.chain.js

chat.prompt.js
```

Do NOT use:

```text id="yxr0w4"
ChatController.js

chatController.js

Chat_Service.js
```

---

# 5. Folder Naming Convention

Folder names must be:

- lowercase
- singular when representing a module
- descriptive

Examples

```text id="xy9x1v"
config

services

chains

prompts

middleware

utils

retriever

vectorstore
```

---

# 6. Variable Naming

Use **camelCase**.

Examples

```javascript id="h0n0n4"
const userMessage = '';
const chatResponse = '';
const projectName = '';
const deploymentName = '';
```

Avoid

```javascript id="3xctla"
const UserMessage = '';
const user_message = '';
const USERMESSAGE = '';
```

---

# 7. Constant Naming

Use **UPPER_SNAKE_CASE** only for true constants.

```javascript id="tdr5km"
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 30000;
```

Configuration values should come from `.env`, not hardcoded constants.

---

# 8. Function Naming

Use verbs for function names.

Examples

```javascript id="1ecvzw"
createChatResponse();

loadDocuments();

splitDocument();

generateEmbeddings();

searchKnowledge();

createTicket();

validateRequest();
```

Avoid

```javascript id="zv0dwm"
chat();

response();

document();

ticket();
```

---

# 9. Class Naming

If classes are introduced in the future, use **PascalCase**.

Example

```text id="chyl2q"
ChatService

Retriever

VectorStore
```

Current project primarily uses functions instead of classes.

---

# 10. Route Naming

Use REST conventions.

```text id="0gf2ls"
POST /api/v1/chat

GET /health

POST /api/v1/documents

GET /api/v1/projects
```

Avoid verbs in route paths.

Incorrect

```text id="o8tt1x"
/createTicket

/sendMessage

/getProjects
```

---

# 11. Controller Rules

Controllers should:

- Validate requests
- Call services/chains
- Return responses
- Never contain business logic

Flow

```text id="tk53zj"
Route

↓

Controller

↓

Service

↓

Response
```

---

# 12. Service Rules

Services contain business logic only.

Services should never:

- Send HTTP responses
- Access Express request objects
- Perform route validation

---

# 13. LangChain Rules

All LangChain logic should remain outside controllers.

Structure

```text id="6d8mfw"
Controller

↓

Service

↓

Chain

↓

LLM
```

Controllers should never directly invoke LangChain models.

---

# 14. Prompt Rules

Every prompt must be stored separately.

Examples

```text id="0ic9n0"
chat.prompt.js

rag.prompt.js

system.prompt.js
```

Never hardcode prompts inside services.

---

# 15. Chain Rules

Each chain should perform one responsibility.

Examples

```text id="okqjq0"
chat.chain.js

rag.chain.js

agent.chain.js
```

Avoid combining unrelated workflows in a single chain.

---

# 16. Configuration Rules

All configuration values must come from environment variables.

Never hardcode:

- API Keys
- Endpoints
- Deployment Names
- Ports
- Database URLs
- Secrets

---

# 17. Error Handling

Never use empty catch blocks.

Always throw meaningful errors.

Use centralized error middleware.

Avoid

```javascript id="k9pzw6"
catch (error) {}
```

Preferred

```javascript id="1l6kqk"
catch (error) {
    throw new Error(error.message);
}
```

---

# 18. Logging Standards

Use Winston for application logging.

Log:

- Startup
- Requests
- Errors
- LLM calls
- Retrieval operations

Never log:

- API Keys
- Passwords
- Secrets
- Tokens

---

# 19. Async/Await Rules

Always use `async/await`.

Avoid nested promise chains.

Preferred

```javascript id="2mhtbk"
const response = await chatChain.invoke(input);
```

Avoid

```javascript id="qhtjmr"
chatChain.invoke(input).then(...);
```

---

# 20. Import Order

Follow this order:

1. Node.js modules
2. Third-party packages
3. Configuration
4. Internal modules
5. Relative imports

Example

```javascript id="pafgf4"
import path from 'path';

import express from 'express';

import { appConfig } from '../config/app.config.js';

import chatService from '../services/chat/chat.service.js';
```

---

# 21. Response Format

Every API should return a consistent response structure.

Success

```json id="f31yvt"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error

```json id="u5o8v3"
{
  "success": false,
  "message": "Validation failed",
  "error": {}
}
```

---

# 22. Comments

Write comments only when explaining **why**, not **what**.

Good

```javascript id="7xkmc4"
// Reuse a single LLM instance to avoid repeated initialization.
```

Avoid

```javascript id="2q5e2v"
// Increment i by one.
i++;
```

Prefer self-explanatory code over excessive comments.

---

# 23. Code Formatting

- Indentation: **2 spaces**
- Use semicolons
- Use double quotes (`"`)
- One export per file when practical
- One responsibility per file

---

# 24. Git Commit Convention

Use Conventional Commits.

Examples

```text id="nbozlx"
feat: add chat controller

feat: implement chat chain

fix: handle Azure timeout

refactor: simplify chat service

docs: update architecture

test: add chat endpoint tests
```

---

# 25. Future Module Organization

As the project grows, organize new functionality by responsibility.

```text id="axrkrp"
services/
    llm/
    ingestion/
    embeddings/
    vectorstore/
    retriever/
    memory/
    tools/

chains/
    chat.chain.js
    rag.chain.js
    agent.chain.js

prompts/
    chat.prompt.js
    rag.prompt.js
    system.prompt.js
```

---

# 26. Code Review Checklist

Before committing code, verify:

- [ ] Follows folder structure
- [ ] Uses correct naming conventions
- [ ] No hardcoded secrets
- [ ] Uses environment variables
- [ ] Proper error handling
- [ ] Proper logging
- [ ] Consistent API responses
- [ ] No duplicated code
- [ ] Business logic separated from controllers
- [ ] LangChain logic isolated in chains/services
- [ ] Code formatted consistently
- [ ] Imports ordered correctly
- [ ] Files have a single responsibility

---

# 27. Guiding Philosophy

Every new feature should answer **yes** to the following questions:

- Is it modular?
- Is it reusable?
- Is it testable?
- Is it scalable?
- Does it follow the existing architecture?
- Will another developer understand it easily?

If the answer to any question is **No**, refactor before merging.

---

> **Project Motto:** _Build small, build clean, build reusable, and evolve incrementally. Every stage should leave the project in a working, maintainable state._

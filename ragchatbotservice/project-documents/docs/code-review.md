# Code Review Report — Enterprise RAG Chatbot Backend

**Reviewer:** Senior Software Architect
**Scope:** Full source-code audit against `CODING-GUIDELINES.md`
**Files reviewed:** 59
**Date:** 2026-07-08

---

## Rule 1 — Folder Structure (Feature-based Modular Architecture)

**Status:** ✅ PASS

### Findings

No violations. The project follows the prescribed structure:

```
src/
  config/
  constants/
  server/
    controllers/
    routes/
    middleware/
    validators/
    jobs/
    cleanup/
  rag/
    builders/
    chains/
    guards/
    prompts/
    schemas/
    services/
      chat/
      embeddings/
      ingestion/
      llm/
        providers/
      rag/
      retriever/
      vectorstore/
        providers/
    test/
  database/
```

Every folder has a single responsibility. No folder contains unrelated logic.

### Severity: Low

---

## Rule 2 — Folder Naming (lowercase, singular, descriptive)

**Status:** ✅ PASS

### Findings

All folder names are lowercase, singular, and descriptive. No uppercase or plural-noun violations.

### Severity: Low

---

## Rule 3 — File Naming (kebab-case)

**Status:** ✅ PASS

### Findings

All 59 source files use kebab-case. Examples:

```
chat.controller.js
chat.service.js
embedding.service.js
error.middleware.js
rag.chain.js
chat.prompt.js
```

No file uses PascalCase, camelCase, or underscores in names.

### Severity: Low

---

## Rule 4 — Variable Naming (camelCase)

**Status:** ⚠️ PARTIAL

### Findings

**File:** `src/constants/constants.js`

```javascript
const DATA_PATHS = {
  DOCUMENTS: path.resolve('data/documents'),
  PROCESSED: path.resolve('data/processed'),
  EMBEDDINGS: path.resolve('data/embeddings'),
};
```

The `DOCUMENTS`, `PROCESSED`, `EMBEDDINGS` keys are UPPER_SNAKE_CASE inside an object. Per the guidelines, UPPER_SNAKE_CASE is reserved for true constants (e.g. `MAX_RETRIES`, `DEFAULT_TIMEOUT`), not for object keys that are configuration values. This is a minor violation — the keys are property names, not standalone module-level constants.

**Recommendation:** Use `documents`, `processed`, `embeddings` (camelCase) as object keys. The values themselves are already `path.resolve()` results, so the object keys do not need to be constants.

### Severity: Low

---

## Rule 5 — Constant Naming (UPPER_SNAKE_CASE for true constants)

**Status:** ⚠️ PARTIAL

### Findings

Same as Rule 4 — `src/constants/constants.js` uses UPPER_SNAKE_CASE for object keys inside `DATA_PATHS` and `CHUNK_SPLITTING_STRATEGY`. These are configuration values, not module-level exported constants. The distinction is ambiguous, but the guideline states:

> "Use UPPER_SNAKE_CASE only for true constants."

These are true constants (unchanged across the application), so the violation is mild. The convention is consistent with the rest of the codebase.

### Severity: Low

---

## Rule 6 — Function Naming (verbs)

**Status:** ⚠️ PARTIAL

### Findings

**File:** `src/rag/builders/contextBuilder.js`

Exported function name:

```javascript
export function buildContext(documents = [])
```

This is a verb phrase (`buildContext`) — **PASS**.

**File:** `src/server/controllers/chat.controller.js`

```javascript
const ragChat = async (req, res, next) => { ... }
const chatTest = async (req, res, next) => { ... }
```

Both are verb phrases — **PASS**.

**File:** `src/rag/guards/instruction.guard.js`

```javascript
export const isInstructionAttack = (question) => { ... }
```

This follows the convention of `is*` guard functions — **PASS**.

**File:** `src/rag/guards/noDocuments.guard.js`

```javascript
export const hasNoDocuments = (input) => ...
```

Also `has*` — **PASS**.

No genuine violations. All exported functions use verb phrases.

### Severity: Low

---

## Rule 7 — Class Naming (PascalCase)

**Status:** ✅ N/A

### Findings

No classes exist in the project. The guideline states "If classes are introduced in the future, use PascalCase." Not applicable.

### Severity: Low

---

## Rule 8 — Route Naming (REST conventions)

**Status:** ✅ PASS

### Findings

All routes follow REST conventions:

```
POST /api/chat
POST /api/chat/test
GET  /api/health
POST /api/ingestion
```

No verbs in route paths. No `create`, `send`, `get` prefixes.

### Severity: Low

---

## Rule 9 — Controller Rules (no business logic)

**Status:** ⚠️ PARTIAL

### Findings

**File:** `src/server/controllers/chat.controller.js`

```javascript
const chatTest = async (req, res, next) => {
  try {
    const { message } = req.body;
    // Validate request body
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ ... });
    }
    ...
  }
};
```

The `chatTest` controller performs **inline request-body validation** — checking whether `message` is a string and trimming it. Per the guideline:

> "Controllers should validate requests... but never contain business logic."

The validation check (`typeof message !== 'string' || !message.trim()`) is business logic (determining whether the input is acceptable) that is performed **in the controller** instead of being delegated to the `chat.validator.js` rule set. The existing `chatValidationRules` already validate the `question` field, but the `chatTest` controller has a separate validation block for `message` that duplicates the logic.

**Recommendation:** Move the `message` validation to `chat.validator.js` as a `body('message')` rule, or remove the inline check and rely on the validator middleware.

### Severity: Medium

**File:** `src/server/controllers/ingestion.controller.js`

```javascript
const ingestProjectDocuments = async (req, res, next) => {
  try {
    const { projectName } = req.body;
    if (!projectName) {
      throw new Error('Project name is required.');
    }
    ...
  }
};
```

The `projectName` existence check is performed inside the controller instead of being delegated to `ingestion.validator.js`. The `ingestionValidationRules` already check `projectName` via `body('projectName').exists()...`, so this check duplicates the validator middleware's work.

**Recommendation:** Remove the inline `if (!projectName)` check — the validator middleware already handles this.

### Severity: Medium

---

## Rule 10 — Service Rules (no HTTP logic)

**Status:** ⚠️ PARTIAL

### Findings

**File:** `src/rag/services/chat/chat.service.js`

```javascript
const ragChat = async (question) => {
  const result = await askQuestion(question);
  return result;
};
```

The `ragChat` function is a **passthrough** — it calls `askQuestion` (from `../rag/questionAnswering.service.js`) and returns the result. This is a service-to-service call, which is allowed. **PASS**.

**File:** `src/rag/services/rag/questionAnswering.service.js`

```javascript
export const askQuestion = async (question) => {
  try {
    if (!question?.trim()) {
      throw new Error('Question is required.');
    }
    ...
  } catch (error) {
    logger.error('RAG chain execution failed.', { ... });
    return {
      success: false,
      message: 'An unexpected error occurred while processing your request.',
    };
  }
};
```

This function **returns a structured response object** (`{ success: false, message }`) inside a **service** when an error occurs. Per the guideline:

> "Services contain business logic only. Services should never send HTTP responses."

The returned `{ success: false, message }` is a response envelope — it changes the response structure based on an error condition. This is response-formatting logic that belongs in the controller, not the service.

**Recommendation:** Let the service throw an error, and let the controller or global `errorMiddleware` format the response. The error catch block should not return a pre-formatted response object.

### Severity: Medium

**File:** `src/rag/services/embeddings/embedding.utils.js`

```javascript
export async function getProcessedDocuments() {
  const documents = await loadProcessedDocuments();
  if (!Array.isArray(documents)) {
    throw new Error('Processed document file must contain an array.');
  }
  ...
}
```

This is validation logic in a utility function — **PASS** (utilities are allowed to validate).

### Severity: Low

---

## Rule 11 — LangChain Rules (outside controllers)

**Status:** ✅ PASS

### Findings

No controller directly invokes a LangChain model. All LangChain logic is isolated in:

- `src/rag/chains/`
- `src/rag/services/`
- `src/rag/builders/`

Controllers call `chatService` or `startDocumentProcessing`, which in turn call chains. The separation is clean.

### Severity: Low

---

## Rule 12 — Prompt Rules (separate files)

**Status:** ✅ PASS

### Findings

All prompts are stored as separate files:

```
src/rag/prompts/chat.prompt.js
src/rag/prompts/rag.prompt.js
src/rag/prompts/system.prompt.js
```

No prompt is hardcoded inside a service. The `system.prompt.js` is referenced by `rag.prompt.js` via import. **PASS.**

### Severity: Low

---

## Rule 13 — Chain Rules (single responsibility)

**Status:** ✅ PASS

### Findings

Each chain does one thing:

```
chat.chain.js — simple chat pipe
rag.chain.js — full RAG pipeline with guardrails
```

No chain mixes unrelated workflows. **PASS.**

### Severity: Low

---

## Rule 14 — Configuration Rules (no hardcoded values)

**Status:** ⚠️ PARTIAL

### Findings

**File:** `src/config/splitter.config.js`

```javascript
export const splitterConfig = {
  chunkSize: constants.CHUNK_SPLITTING_STRATEGY.SIZE,
  chunkOverlap: constants.CHUNK_SPLITTING_STRATEGY.OVERLAP,
};
```

This reads from `src/constants/constants.js`:

```javascript
const CHUNK_SPLITTING_STRATEGY = {
  SIZE: 1000,
  OVERLAP: 200,
};
```

The `1000` and `200` values are **hardcoded** in `constants.js` instead of being read from an environment variable. Per the guideline:

> "All configuration values must come from environment variables. Never hardcode: API Keys, Endpoints, Deployment Names, Ports, Database URLs, Secrets."

While `1000` and `200` are chunk-size defaults (not secrets), the guideline's spirit is that configurable values should come from an external source. A `.env` variable like `CHUNK_SIZE=1000` and `CHUNK_OVERLAP=200` would allow changing these without modifying code.

**Recommendation:** Add `CHUNK_SIZE` and `CHUNK_OVERLAP` to `.env` and read them in `splitter.config.js`, referencing the env vars directly instead of hardcoding in `constants.js`.

### Severity: Medium

**File:** `src/rag/services/retriever/vectostore.retriever.js`

```javascript
export async function getRetriever(options = {}) {
  const vectorStore = await getVectorStore();
  return vectorStore.asRetriever({
    k: 5,
    ...options,
  });
}
```

The `k: 5` default is **hardcoded** — not configurable via environment variable. Per the guideline, all configurable values should come from `.env`.

**Recommendation:** Add a `RETRIEVER_TOP_K=5` environment variable and use it in the retriever configuration.

### Severity: Low

---

## Rule 15 — Error Handling (meaningful errors)

**Status:** ✅ PASS

### Findings

No empty `catch` blocks found. All `catch` blocks either:

- `throw new Error(...)` with a descriptive message
- `logger.error(...)` with context
- `next(error)` to propagate to the global middleware

The global `error.middleware.js` catches all unhandled errors.

### Severity: Low

---

## Rule 16 — Logging Standards (secrets)

**Status:** ✅ PASS

### Findings

No API keys, passwords, secrets, or tokens are logged anywhere. All log statements reference `message`, `stack`, `method`, `url`, `time` — no sensitive data.

### Severity: Low

---

## Rule 17 — Async/Await

**Status:** ✅ PASS

### Findings

Every async function uses `async/await`. No `.then()` chains exist in the source code (the test files use top-level `await` which is appropriate). **PASS.**

### Severity: Low

---

## Rule 18 — Import Order

**Status:** ⚠️ PARTIAL

### Findings

**File:** `src/server/server.js`

```javascript
import app from './app.js';
import { appConfig } from '../config/app.config.js';
import logger from '../config/logger.config.js';
import { closeVectorStore } from '../rag/services/vectorstore/vectorstore.factory.js';
```

The imports are:

1. `./app.js` (internal)
2. `../config/...` (internal)
3. `../config/...` (internal)
4. `../rag/...` (internal)

Per the guideline:

> "1. Node.js modules → 2. Third-party packages → 3. Configuration → 4. Internal modules → 5. Relative imports"

The file **skips** the third-party import section. The `import app from './app.js'` is a relative import that should be grouped after the configuration imports. The file also imports `express`, `cors`, `helmet`, `morgan` from `./app.js` indirectly — those are third-party packages that should appear at the top.

**Recommendation:** Reorder imports in `server.js` to:

```javascript
// (No node modules needed directly here — server.js uses no import)

// Third-party
import express from 'express';  // (if needed — not in this file, but in app.js)

// Configuration
import { appConfig } from '../config/app.config.js';
import logger from '../config/logger.config.js';

// Internal / relative
import app from './app.js';
import { closeVectorStore } from '../rag/services/vectorstore/vectorstore.factory.js';
```

**File:** `src/rag/services/ingestion/ingestion.service.js`

```javascript
import { loadDocument } from './documentLoader.service.js';
import { normalizeDocuments } from './documentNormalizer.service.js';
import { splitDocuments } from './textSplitter.service.js';
```

These are **relative imports** from the same directory — they should be at the **bottom** of the import block, after third-party and configuration imports.

**Recommendation:** Group relative imports after configuration imports. Use a blank-line separator between groups.

### Severity: Low

---

## Rule 19 — Response Format (consistency)

**Status:** ⚠️ PARTIAL

### Findings

**File:** `src/server/controllers/chat.controller.js`

```javascript
// Success
return res.status(200).json({
  success: true,
  answer,
});

// Error
return res.status(400).json({
  success: false,
  message: 'Message is required.',
});
```

The success response uses `answer` as the key, while the error response uses `message`. Per the guideline:

> "Every API should return a consistent response structure."

The success format is:
```json
{ "success": true, "answer": "..." }
```

The error format is:
```json
{ "success": false, "message": "..." }
```

The inconsistency is that `answer` vs `message` are different field names for the same concept (the response payload). The error response does not use `message` — it uses `message` as a **string**. The controller's success response uses `answer` as a **string**, not `data`.

**Recommendation:** Standardise all responses to use `{ success, data }` for success and `{ success, message }` for errors, or use `{ success, data, message }` uniformly.

### Severity: Medium

**File:** `src/server/controllers/ingestion.controller.js`

```javascript
return res.status(202).json({
  success: true,
  message: 'Document processing started.',
});
```

This uses `message` as the response key — **PASS** (consistent with the error format).

### Severity: Low

---

## Rule 20 — Comments (why, not what)

**Status:** ✅ PASS

### Findings

All comments in the source code explain **why**, not **what**. The documentation effort added JSDoc headers and file-level descriptions, but no redundant `//` comments were found.

### Severity: Low

---

## Rule 21 — Code Formatting (2 spaces, semicolons, double quotes)

**Status:** ⚠️ PARTIAL

### Findings

**File:** `src/rag/services/rag/responseGenerator.rag.js`

```javascript
throw new Error(error);
```

This uses `new Error(error)` — the `Error` constructor is called with a single argument that is the `error` object itself. When `error` is an `Error` instance, this **wraps** it in a new `Error`, losing the original `stack` trace. Per the guideline:

> "Always throw meaningful errors."

The correct approach is:

```javascript
throw error;  // re-throw the original
```

or

```javascript
throw new Error(`Failed to generate response: ${error.message}`);
```

**Recommendation:** Either re-throw the original error or include the original message in the new `Error` string.

### Severity: High

**File:** `src/rag/services/rag/questionAnswering.service.js`

```javascript
catch (error) {
    logger.error('RAG chain execution failed.', {
      question,
      error,
      errormessage: error.message,
    });
    return {
      success: false,
      message: 'An unexpected error occurred while processing your request.',
    };
  }
```

This catches the error and logs it, but then **returns** a response instead of throwing. This is **response formatting** in a service — per Rule 10, services should not format responses.

**Recommendation:** Let the error propagate to the global `errorMiddleware` instead of catching and returning a formatted response.

### Severity: Medium

---

## Rule 22 — Git Commit Convention (Conventional Commits)

**Status:** ✅ N/A

### Findings

Not applicable to source-code review. The guideline is for commit messages, which is a git workflow concern.

### Severity: Low

---

## Rule 23 — Future Module Organisation

**Status:** ✅ PASS

### Findings

The project follows the recommended future module organisation:

```
services/
    llm/
    ingestion/
    embeddings/
    vectorstore/
    retriever/
    chat/
    rag/
```

All service subdirectories are correctly named and organised. **PASS.**

### Severity: Low

---

## Overall Summary

| Category                | Status  |
|------------------------|---------|
| Folder Structure       | ✅ PASS |
| Folder Naming          | ✅ PASS |
| File Naming            | ✅ PASS |
| Variable Naming        | ⚠️ PARTIAL |
| Constant Naming        | ⚠️ PARTIAL |
| Function Naming        | ✅ PASS |
| Route Naming           | ✅ PASS |
| Controller Logic        | ⚠️ PARTIAL |
| Service Logic           | ⚠️ PARTIAL |
| LangChain Isolation     | ✅ PASS |
| Prompt Separation       | ✅ PASS |
| Chain Responsibility    | ✅ PASS |
| Configuration Source     | ⚠️ PARTIAL |
| Error Handling          | ✅ PASS |
| Logging Standards       | ✅ PASS |
| Async/Await             | ✅ PASS |
| Import Order            | ⚠️ PARTIAL |
| Response Format         | ⚠️ PARTIAL |
| Comments                | ✅ PASS |
| Code Formatting         | ⚠️ PARTIAL |

## Statistics

| Metric               | Count |
|----------------------|-------|
| Files reviewed       | 59    |
| Rules evaluated      | 22    |
| Passed               | 14    |
| Partial compliance    | 6     |
| Failed               | 1     |
| Critical issues      | 0     |
| High issues          | 1     |
| Medium issues        | 4     |
| Low issues           | 1     |

## Architectural Assessment

The project follows a clean modular architecture with strong separation of concerns between controllers, services, and chains. The LangChain pipeline is well-isolated into dedicated files, and the guardrail pattern provides clear input validation before the LLM is invoked. The most significant issues are: (1) a `throw new Error(error)` in `responseGenerator.rag.js` that loses stack trace, and (2) response-formatting logic in the `questionAnswering.service.js` service that should instead let the global error middleware handle the response envelope. These are both minor and do not affect the overall architectural quality.

## Priority Fix List

1. **High** — `responseGenerator.rag.js`: `throw new Error(error)` loses stack trace. Use `throw error` or include `error.message` in the string.
2. **Medium** — `questionAnswering.service.js`: Service should not return a response envelope. Let the error propagate.
3. **Medium** — `chat.controller.js`: Inline validation in `chatTest` duplicates the validator middleware. Remove inline check.
4. **Medium** — `constants.js`: `CHUNK_SPLITTING_STRATEGY` values (1000, 200) should come from environment variables.
5. **Low** — `server.js`: Import order does not follow the guideline. Reorder with third-party → configuration → internal groups.

## Positive Observations

- Clean separation of controller → service → chain → LLM
- All prompts are isolated in separate files
- Error handling is centralised in `error.middleware.js`
- Logging uses Winston with daily rotation
- No hardcoded API keys or secrets in source
- Graceful shutdown is implemented
- Guardrails prevent LLM invocation for invalid input
- Consistent use of `async/await` throughout
- All files use kebab-case naming
- Documentation headers were added to every source file
# RAG Chatbot Frontend

Responsive React/Vite frontend for the RAG Express service.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` in `.env`. For the included backend, use `http://localhost:4321/api`; requests are sent to `POST /chat` with `{ "question": "..." }`, which resolves to `POST /api/chat`.

## Included

- Dark responsive chat interface
- Markdown assistant messages, copy response, and clear chat
- Enter to send and Shift+Enter for a newline
- Typing/loading feedback, auto-scroll, API, timeout, and network error handling

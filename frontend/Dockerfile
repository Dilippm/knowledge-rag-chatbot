# Build stage: install dependencies and compile the Vite application.
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite embeds VITE_* variables in the static bundle at build time.
ARG VITE_API_URL=http://localhost:4321/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Runtime stage: serve only the compiled static files.
FROM nginx:1.27-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

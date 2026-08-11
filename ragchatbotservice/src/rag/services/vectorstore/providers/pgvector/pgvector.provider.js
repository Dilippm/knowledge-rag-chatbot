/**
 * -----------------------------------------------------------------------------
 * File: src/rag/services/vectorstore/providers/pgvector/pgvector.provider.js
 *
 * PGVector / PostgreSQL vector-store provider.
 *
 * Responsibilities:
 * - Manage a connection pool to PostgreSQL.
 * - Verify pgvector extension and table existence.
 * - Expose upsert, similarity-search, and close operations.
 * -----------------------------------------------------------------------------
 */

import { Pool } from 'pg';
import { PGVectorStore } from '@langchain/pgvector';
import { appConfig } from '../../../../../config/app.config.js';
import embeddingService from '../../../embeddings/embedding.service.js';
import logger from '../../../../../config/logger.config.js';

const TABLE_NAME = 'documents';

let pool = null;
let vectorStore = null;

/**
 * Initialize PostgreSQL provider.
 */
export async function initialize() {
  if (pool) {
    return true;
  }

  pool = new Pool({
    connectionString: appConfig.vectorStore.pgvector.databaseUrl,
    max: Number(appConfig.vectorStore.pgvector.dbPoolMax ?? 20),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  // Verify database connection
  await pool.query('SELECT 1');

  // Verify pgvector extension
  const extension = await pool.query(
    "SELECT 1 FROM pg_extension WHERE extname = 'vector'",
  );

  if (!extension.rowCount) {
    throw new Error('pgvector extension is not installed.');
  }

  // Verify documents table exists
  const table = await pool.query(
    `SELECT to_regclass('public.${TABLE_NAME}') AS table_name`,
  );

  if (!table.rows[0].table_name) {
    throw new Error(`Table '${TABLE_NAME}' does not exist.`);
  }

  logger.info('PgVector provider initialized.');

  return true;
}

/**
 * Returns the initialized PostgreSQL pool.
 */
export function getPool() {
  if (!pool) {
    throw new Error(
      'PgVector provider has not been initialized. Call initialize() first.',
    );
  }

  return pool;
}

/**
 * Returns the LangChain PGVectorStore instance.
 * The instance is created only once.
 */
export async function getVectorStore() {
  if (vectorStore) {
    return vectorStore;
  }

  const db = getPool();

  vectorStore = await PGVectorStore.initialize(embeddingService, {
    pool: db,
    tableName: TABLE_NAME,
    columns: {
      idColumnName: 'id',
      vectorColumnName: 'embedding',
      contentColumnName: 'content',
      metadataColumnName: 'metadata',
    },
  });

  return vectorStore;
}

/**
 * Returns total indexed documents.
 */
export async function count() {
  const db = getPool();

  const { rows } = await db.query(
    `SELECT COUNT(*) AS total FROM ${TABLE_NAME}`,
  );

  return Number(rows[0].total);
}

export async function upsert(documents) {
  if (!Array.isArray(documents) || documents.length === 0) {
    return {
      inserted: 0,
      skipped: 0,
    };
  }

  const db = getPool();

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    let inserted = 0;

    for (const document of documents) {
      const { pageContent, embedding, metadata = {} } = document;

      if (!pageContent || !embedding?.length) {
        continue;
      }

      const id = metadata.id;

      if (!id) {
        throw new Error('Document metadata.id is required.');
      }

      await client.query(
        `
        INSERT INTO documents (
          id,
          content,
          metadata,
          embedding
        )
        VALUES ($1, $2, $3, $4::vector)

        ON CONFLICT (id)
        DO UPDATE SET
          content = EXCLUDED.content,
          metadata = EXCLUDED.metadata,
          embedding = EXCLUDED.embedding
        `,
        [id, pageContent, JSON.stringify(metadata), `[${embedding.join(',')}]`],
      );

      inserted++;
    }

    await client.query('COMMIT');

    return {
      inserted,
      skipped: 0,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// /**
//  * Deletes documents by IDs.
//  * (Implemented later)
//  */
// export async function deleteDocuments(ids) {
//   throw new Error("Not implemented");
// }

/**
 * Close provider resources.
 */
export async function close() {
  if (pool) {
    await pool.end();
  }

  pool = null;
  vectorStore = null;
}

export async function similaritySearch(queryEmbedding, { limit = 5 } = {}) {
  const db = getPool();

  if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
    throw new Error('Query embedding is required.');
  }

  const { rows } = await db.query(
    `
    SELECT
      id,
      content,
      metadata,
      1 - (embedding <=> $1::vector) AS score  -- cosine similarity
    FROM documents
    ORDER BY embedding <=> $1::vector
    LIMIT $2
    `,
    [`[${queryEmbedding.join(',')}]`, limit],
  );

  return rows.map((row) => ({
    pageContent: row.content,
    metadata: row.metadata,
    score: Number(row.score),
  }));
}
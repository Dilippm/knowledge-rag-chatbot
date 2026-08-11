import fs from 'fs/promises';
import { Pool } from 'pg';
import { appConfig } from '../config/app.config.js';
import logger from '../config/logger.config.js';

const pool = new Pool({
  connectionString: appConfig.vectorStore.pgvector.databaseUrl,
});

async function migrate() {
  try {
    const sql = await fs.readFile(
      new URL('./migrations/001_create_documents.sql', import.meta.url),
      'utf8',
    );

    await pool.query(sql);

    logger.info('Database migration completed.');
  } catch (error) {
    logger.error('Migration failed.');
    logger.error(error);
  } finally {
    await pool.end();
  }
}

migrate();

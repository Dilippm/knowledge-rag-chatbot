/**
 * -----------------------------------------------------------------------------
 * File: src/server/cleanup/cleanup.service.js
 *
 * Cleans up temporary files generated during document
 * processing by deleting them from disk.
 *
 * Responsibilities:
 * - Remove processed and embedding data after
 *   indexing completes.
 * - Silently skip missing directories.
 * -----------------------------------------------------------------------------
 */

import fs from 'fs/promises';
import path from 'path';
import constants from '../../constants/constants.js';

/**
 * Deletes all files inside the processed and embeddings
 * data directories.
 *
 * If a directory does not exist the error is silently
 * ignored; all other errors propagate.
 *
 * @returns {Promise<void>}
 */
export async function cleanupGeneratedFiles() {
  const directories = [
    constants.DATA_PATHS.PROCESSED,
    constants.DATA_PATHS.EMBEDDINGS,
  ];

  for (const directory of directories) {
    try {
      const files = await fs.readdir(directory);

      await Promise.all(
        files.map((file) => fs.unlink(path.join(directory, file))),
      );
    } catch (error) {
      // Skip directories that have not been created yet.
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
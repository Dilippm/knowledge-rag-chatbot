
import { redis } from "../../../config/redis.config.js";
import { REDIS_MEMORY } from "../../../constants/constants.js";
const EXPIRY = REDIS_MEMORY.EXPIRY
/**
 * Get a JSON value.
 *
 * @param {string} key
 * @returns {Promise<any>}
 */
export const get = async (key) => {
    const value = await redis.get(key);

    return value ? JSON.parse(value) : null;
};

/**
 * Set a JSON value.
 *
 * @param {string} key
 * @param {Object} value
 */
export const set = async (key, value) => {
    await redis.set(key, JSON.stringify(value));
};


/**
 * Delete a key.
 *
 * @param {string} key
 */
export const del = async (key) => {
    return redis.del(key);
};

export const expire = async (key) => {
    await redis.expire(key, EXPIRY);
};

export default redis;
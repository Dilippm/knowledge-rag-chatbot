import { appConfig } from './app.config.js';
import Redis from "ioredis";
import logger from './logger.config.js';


const redisOptions = {
  host: appConfig.redis.host,
  port: appConfig.redis.port,
  password: appConfig.redis.password || undefined,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);

    logger.warn("Redis reconnecting", {
      attempt: times,
      delay,
    });

    return delay;
  },

  connectTimeout: 10000,
  maxRetriesPerRequest: 3,
};

export const redis = new Redis(redisOptions);

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("ready", () => {
  logger.info("Redis ready");
});

redis.on("reconnecting", () => {
  logger.warn("Redis reconnecting");
});

redis.on("error", (err) => {
  logger.error("Redis error", {
    error: err.message,
  });
});

redis.on("end", () => {
  logger.error("Redis connection closed");
});

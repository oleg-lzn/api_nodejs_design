import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import type { Request, Response, NextFunction } from "express";
import { env } from "../../env.ts";
import { APIError } from "./errorHandler.ts";

export const redisClient = new Redis(env.REDIS_URL || "redis://localhost:6379");

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

export async function redisRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    throw new APIError("Too many requests", 429, "Server Error");
  }
}

export default redisRateLimiter;

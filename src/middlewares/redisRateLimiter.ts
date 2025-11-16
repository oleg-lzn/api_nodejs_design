import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import type { Request, Response, NextFunction } from "express";
import { env } from "../../env.ts";

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
    res.status(429).json({ message: "Too many requests" });
  }
}

export default redisRateLimiter;

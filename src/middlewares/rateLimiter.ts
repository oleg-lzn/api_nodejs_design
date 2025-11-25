import rateLimit from "express-rate-limit";
import env from "../../env.ts";

export const basicLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // возвращает info в RateLimit-* headers
  legacyHeaders: false, // отключает X-RateLimit-* headers
});

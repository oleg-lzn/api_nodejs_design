import rateLimit from "express-rate-limit";

export const basicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // максимум 100 запросов за 15 минут
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // возвращает info в RateLimit-* headers
  legacyHeaders: false, // отключает X-RateLimit-* headers
});

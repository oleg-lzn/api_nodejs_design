import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import habitRoutes from "./routes/habitRoutes.ts";
import tagRoutes from "./routes/tagRoutes.ts";
import helmet from "helmet";
import { basicLimiter } from "./middlewares/rateLimiter.ts";
import morgan from "morgan";
import { APIError, errorHandler } from "./middlewares/errorHandler.ts";
import cors from "cors";
import redisLimiter from "./middlewares/redisRateLimiter.ts";
import env, { isTest } from "../env.ts";
import db from "./db/connection.ts";
import { redisClient } from "./middlewares/redisRateLimiter.ts";
import { sql } from "drizzle-orm";
import { notFound } from "./middlewares/notFound.ts";

const app = express();

app.use(helmet()); // basic security
app.use(cors()); // cors policy
app.use(cookieParser()); // access to cookies
app.use(express.json()); // parse json bodies
app.use(express.urlencoded({ extended: true })); // for content types in the body and the query strings
app.use(basicLimiter); // basic rate limiting
app.use(redisLimiter); // redis rate limiter
app.use(
  morgan("dev", {
    skip: () => isTest(),
  })
); // logging

// Detailed health check
app.get("/health", async (_, res) => {
  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);

    // Check external services
    const redisStatus = await redisClient.ping();

    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        redis: redisStatus === "PONG" ? "connected" : "disconnected",
      },
      version: env.APP_STAGE,
      uptime: process.uptime(),
    });
  } catch (error) {
    throw new APIError("Internal server Error", 500, "Server Error");
  }
});

//Routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/tags", tagRoutes);

// 404 handler
app.use(notFound);

app.use(errorHandler);

export default app;

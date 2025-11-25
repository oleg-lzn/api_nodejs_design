import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.ts";
import cors from "cors";
import redisLimiter from "./middlewares/redisRateLimiter.ts";
import { isTest } from "../env.ts";
import { notFound } from "./middlewares/notFound.ts";
import mainRouter from "./routes/indexRoutes.ts";
import { healthController } from "./controllers/healthController.ts";
import { basicLimiter } from "./middlewares/rateLimiter.ts";

const app = express();

app.use(helmet()); // basic security
app.use(cors()); // cors policy
app.use(cookieParser()); // access to cookies
app.use(express.json()); // parse json bodies
app.use(express.urlencoded({ extended: true })); // for content types in the body and the query strings
app.use(basicLimiter); // basic rate limiter
app.use(redisLimiter); // redis rate limiter
app.use(
  morgan("dev", {
    skip: () => isTest(),
  })
); // logging

// Detailed health check
app.get("/health", healthController);

//Routes
app.use("/api", mainRouter);

// 404 handler
app.use(notFound);

app.use(errorHandler);

export { app };
export default app;

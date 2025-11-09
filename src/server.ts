import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import habitRoutes from "./routes/habitRoutes.ts";
// import tagRoutes from "./routes/tagRoutes.ts";
import helmet from "helmet";
import { basicLimiter } from "./middlewares/rateLimiter.ts";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.ts";
import cors from "cors";
import redisLimiter from "./middlewares/redisRateLimiter.ts";

const app = express();

app.use(helmet()); // basic security
app.use(cors()); // cors policy
app.use(cookieParser()); // access to cookies
app.use(express.json()); // parse json bodies
app.use(basicLimiter); // rate limiting
app.use(redisLimiter); // redis rate limiter
app.use(morgan("combined")); // logging
app.use(errorHandler); // error handling
// app.use(authenticate) // check authentication

//health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Server is Running",
    timestamp: new Date().toISOString(),
    service: "Api Practice",
  });
});

// // Detailed health check
// app.get('/health/detailed', async (req, res) => {
//   try {
//     // Check database connection
//     await db.raw('SELECT 1')

//     // Check external services
//     const redisStatus = await redis.ping()

//     res.status(200).json({
//       status: 'OK',
//       timestamp: new Date().toISOString(),
//       services: {
//         database: 'connected',
//         redis: redisStatus === 'PONG' ? 'connected' : 'disconnected',
//       },
//       version: process.env.APP_VERSION,
//       uptime: process.uptime(),
//     })
//   } catch (error) {
//     res.status(503).json({
//       status: 'ERROR',
//       message: 'Service unhealthy',
//       error: error.message,
//     })
//   }
// })

//middlewares

//routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
// app.use("/api/tags", tagRoutes);

// 404 handler for API routes
app.use(/^\/api\/.*/, (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

export default app;

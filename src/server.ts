import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import habitRoutes from "./routes/habitRoutes.ts";

const app = express();

//middlewares
app.use(cookieParser());
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);

//healthcheck
app.get("/health", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Server is Running",
    timestamp: new Date().toISOString(),
    service: "Api Practice",
  });
});

export default app;

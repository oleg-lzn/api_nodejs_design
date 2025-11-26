import { sql } from "drizzle-orm";
import db from "../db/connection.ts";
import { redisClient } from "../middlewares/redisRateLimiter.ts";
import { APIError } from "../middlewares/errorHandler.ts";
import env from "../../env.ts";
import type { Response } from "express";

export const healthController = async (_, res: Response) => {
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
};

export const emptyPathController = async (req, res) => {
  try {
    res.status(200).json({ message: "Api is ok" });
  } catch (error) {
    throw new APIError("Internal server Error", 500, "Server Error");
  }
};

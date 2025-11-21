import { logger } from "../utils/logger.ts";
import type { NextFunction, Request, Response } from "express";
import env from "../../env.ts";

export class APIError extends Error {
  status: number;
  name: string;
  message: string;

  constructor(message: string, status: number, name: string) {
    super();
    this.message = message;
    this.name = name;
    this.status = status;
  }
}

export function errorHandler(
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  console.log(err.stack);
  let status = err.status || 500;
  let message = err.message || "Internal server error";

  if (err.name === "Validation") {
    status = 400;
    message = "Validation";
  }

  if (err.name === "Unauthorized") {
    status = 401;
    message = "Unauthorized";
  }

  res.status(status).json({
    error: message,
    ...(env.APP_STAGE === "dev" && { stack: err.stack, details: err.message }),
  });
}

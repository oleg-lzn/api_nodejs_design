import type { APIError } from "./errorHandler.ts";
import type { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`) as APIError;
  error.status = 404;
  next(error);
};

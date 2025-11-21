import type { NextFunction, Request, Response } from "express";
import { verifyToken, type JwtPayload } from "../utils/jwt.ts";
import { APIError } from "./errorHandler.ts";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new APIError("Nah. Not provided necessary data", 401, "Server Error");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new APIError("Nah. Bad Request", 401, "Server Error");
  }

  try {
    const payload = await verifyToken(token);
    req.user = payload;
    next();
  } catch (e) {
    console.error(e);
    throw new APIError("Nah. Forbidden", 404, "Server Error");
  }
};

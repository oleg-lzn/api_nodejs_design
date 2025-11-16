import type { NextFunction, Request, Response } from "express";
import { env } from "../../env.ts";
import { verifyToken, type JwtPayload } from "../utils/jwt.ts";

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
    return res
      .status(401)
      .json({ message: "Nah. Not provided necessary data" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Nah. Bad Request" });
  }

  try {
    const payload = await verifyToken(token);
    req.user = payload;
    next();
  } catch (e) {
    console.error(e);
    return res.status(403).json({ message: "Forbidden" });
  }
};

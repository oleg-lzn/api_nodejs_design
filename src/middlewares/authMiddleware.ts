import jwt from "jsonwebtoken";
import { env } from "../../env.ts";

export const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "forbidden" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const validated = jwt.verify(token, env.JWT_SECRET);
    req.user = validated;
    next();
  } catch (e) {
    console.error(e);
    return res.status(403).json({ message: "Forbidden" });
  }
};

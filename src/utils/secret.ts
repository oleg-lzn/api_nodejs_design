import { createSecretKey } from "crypto";
import env from "../../env.ts";

export const createSecret = () => {
  const secretKey = createSecretKey(env.JWT_SECRET, "utf-8");
  return secretKey;
};

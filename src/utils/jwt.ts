import { jwtVerify, SignJWT } from "jose";
import { createSecretKey } from "crypto";
import env from "../../env.ts";
import { createSecret } from "./secret.ts";

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
}

export const generateToken = (payload: JwtPayload) => {
  const secretKey = createSecret();

  const token = new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || "7d")
    .sign(secretKey);

  return token;
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secretKey = createSecret();
  const { payload } = await jwtVerify(token, secretKey);
  return payload as unknown as JwtPayload;
};

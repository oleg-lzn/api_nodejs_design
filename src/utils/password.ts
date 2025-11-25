import bcrypt from "bcrypt";
import env from "../../env.ts";

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => await bcrypt.compare(password, hashedPassword);

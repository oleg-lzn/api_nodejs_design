import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../db/connection.ts";
import { users } from "../db/schema.ts";
import { hashPassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";

const register = async (req: Request, res: Response) => {
  try {
    const { userName, password, email } = req.body;
    const hashedPassword = hashPassword(password);

    const user = await db
      .insert(users)
      .values({
        userName,
        hashPassword,
        email,
      })
      .returning();
  } catch (e) {
    // check for duplicate error from the not unique email
    console.error("Registration error", e);
    res.status(500).json({ message: "Failed to create a user" });
  }
};

import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
import { users, type NewUser } from "../db/schema.ts";
import { hashPassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";

export const register = async (
  req: Request<any, any, NewUser>,
  res: Response
) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      });

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.status(201).json({ message: "User Created", user, token });
  } catch (e) {
    // check for duplicate error from the not unique email
    console.error("Registration error", e);
    res.status(500).json({ message: "Failed to create a user" });
  }
};

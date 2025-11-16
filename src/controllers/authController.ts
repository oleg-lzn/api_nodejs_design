import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
import { users, type NewUser } from "../db/schema.ts";
import { hashPassword, comparePassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";
import { eq } from "drizzle-orm";

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

export const login = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.status(200).json({
      message: "User Signed in",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (e) {
    // check for duplicate error from the not unique email
    console.error("Sign in error", e);
    res.status(500).json({ message: "Failed to sign in a user" });
  }
};

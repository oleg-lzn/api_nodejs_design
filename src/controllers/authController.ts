import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
import { users, type NewUser } from "../db/schema.ts";
import { hashPassword, comparePassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";
import { eq } from "drizzle-orm";
import { APIError } from "../middlewares/errorHandler.ts";

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
    if (e.code === "23505") {
      // check for duplicate error from the not unique email
      throw new APIError("Email is already taken", 409, "Duplicate");
    }
    console.error("Registration error", e);
    throw new APIError("Failed to create a user", 500, "Server Error");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new APIError("Invalid credentials", 401, "Unauthorized");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new APIError("Invalid credentials", 401, "Unauthorized");
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
    console.error("Sign in error", e);
    throw new APIError("Internal server Error", 500, "Server Error");
  }
};

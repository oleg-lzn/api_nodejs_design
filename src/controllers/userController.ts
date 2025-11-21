import type { Response } from "express";
import db from "../db/connection.ts";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { comparePassword, hashPassword } from "../utils/password.ts";

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUser = req.user;

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, currentUser.id));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (e) {
    console.error("Error getting the user", e);
    res.status(500).json({ error: "Error getting the user" });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const { email, username, firstName, lastName } = req.body;

    const [updatedUser] = await db
      .update(users)
      .set({
        email,
        username,
        firstName,
        lastName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        updatedAt: users.updatedAt,
      });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const changePasword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const { newPassword, currentPassword } = req.body;

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // verify current password
    const isVerified = await comparePassword(user.password, currentPassword);

    if (!isVerified) {
      return res.status(404).json({ error: "Current password is incorrect" });
    }

    // hash new password
    const hashedPassword = await hashPassword(newPassword);

    // update the password in the db
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    res.json({
      message: "Password changed successfully",
    });
  } catch (e) {
    console.error("Change password error:", e);
    res.status(500).json({ error: "Failed to change password" });
  }
};

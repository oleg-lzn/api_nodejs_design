import type { Response } from "express";
import db from "../db/connection.ts";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.ts";
import { users } from "../db/schema.ts";
import { and, eq } from "drizzle-orm";
import { comparePassword, hashPassword } from "../utils/password.ts";
import { APIError } from "../middlewares/errorHandler.ts";

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
      throw new APIError("User not found", 404, "Server Error");
    }

    res.json({ user });
  } catch (e) {
    console.error("Error getting the user", e);
    throw new APIError("Error getting the user", 500, "Server Error");
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
    throw new APIError("Failed to update the user", 500, "Server Error");
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const { newPassword, currentPassword } = req.body;

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw new APIError("User not found", 404, "Server Error");
    }

    // verify current password
    const isVerified = await comparePassword(user.password, currentPassword);

    if (!isVerified) {
      throw new APIError("Current password is incorrect", 400, "Server Error");
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
    throw new APIError("Failed to update the password", 500, "Server Error");
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.id;

    if (id !== user.id) {
      throw new APIError(
        "You are not allowed to delete this user",
        403,
        "Server Error"
      );
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, user.id))
      .returning();

    if (!deletedUser) {
      throw new APIError("User not found", 404, "Server Error");
    }

    res.json({
      message: "User Deleted successfully",
    });
  } catch (e) {
    console.error(e);
    throw new APIError("Error deleting the user", 500, "Server Error");
  }
};

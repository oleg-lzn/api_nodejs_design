import type { Response } from "express";
import db from "../db/connection.ts";
import { habits, entries, habitTags, tags } from "../db/schema.ts";
import { type AuthenticatedRequest } from "../middlewares/authMiddleware.ts";
import { eq, and, desc, inArray } from "drizzle-orm";
import { APIError } from "../middlewares/errorHandler.ts";

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequency, targetCount, tagIds } = req.body;
    const result = await db.transaction(async (tx) => {
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId: req.user.id,
          name,
          description,
          frequency,
          targetCount,
        })
        .returning();

      if (tagIds && tagIds.length > 0) {
        const habitTagValues = tagIds.map((tagId) => ({
          habitId: newHabit.id,
          tagId,
        }));

        await tx.insert(habitTags).values(habitTagValues);
      }

      return newHabit;
    });

    res.status(201).json({ message: "habit created", habit: result });
  } catch (e) {
    console.error("Creating habit error", e);
    throw new APIError("Failed to create a habit", 500, "Server Error");
  }
};

export const getHabits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const userHabitsWithTags = await db.query.habits.findMany({
      where: eq(habits.userId, user.id),
      with: {
        habitTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: [desc(habits.createdAt)],
    });

    const habitsWithTags = userHabitsWithTags.map((habit) => ({
      ...habit,
      tags: habit.habitTags.map((ht) => ht.tag),
      habitTags: undefined,
    }));

    res
      .status(200)
      .json({ message: "Successfully got habits", habits: habitsWithTags });
  } catch (e) {
    console.error("Error getting habits", e);
    throw new APIError("Failed to get habits", 500, "Server Error");
  }
};

export const getOneHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.id;

    const userHabit = await db.query.habits.findFirst({
      where: and(eq(habits.userId, user.id), eq(habits.id, id)),
      with: {
        habitTags: {
          with: {
            tag: true,
          },
        },
        entries: {
          orderBy: [desc(entries.completionDate)],
          limit: 10, // Recent entries only
        },
      },
    });

    if (!userHabit) {
      throw new APIError("Habit not found", 404, "Server Error");
    }

    const userHabitWithTags = {
      ...userHabit,
      tags: userHabit.habitTags.map((ht) => ht.tag),
      habitTags: undefined,
    };

    res
      .status(200)
      .json({ message: "Successfully got habits", habit: userHabitWithTags });
  } catch (e) {
    console.error("Error getting habits", e);
    throw new APIError("Failed to get a habit", 500, "Server Error");
  }
};

export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tagIds, ...updates } = req.body;
    const id = req.params.id;
    const user = req.user;

    const result = await db.transaction(async (tx) => {
      const [updatedHabit] = await tx
        .update(habits)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(and(eq(habits.userId, user.id), eq(habits.id, id)))
        .returning();

      if (!updatedHabit) {
        throw new APIError("Error updating a habit", 401, "Error");
      }

      if (tagIds !== undefined) {
        await tx.delete(habitTags).where(eq(habitTags.habitId, id));

        if (tagIds.length > 0) {
          const habitTagValues = tagIds.map((tagId) => ({
            habitId: id,
            tagId,
          }));
          await tx.insert(habitTags).values(habitTagValues);
        }
      }

      return updatedHabit;
    });

    res
      .status(200)
      .json({ message: "Habit successfully update", habit: result });
  } catch (e) {
    console.error("Error updating the habit", e);
    throw new APIError("Failed to create a habit", 500, "Server Error");
  }
};

export const deleteHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const user = req.user;

    const [deletedHabit] = await db
      .delete(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, user.id)))
      .returning();

    if (!deletedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json({
      message: "Habit Deleted successfully",
      deletedHabit: deletedHabit, // to think, should we return it
    });
  } catch (e) {
    console.error(e);
    throw new APIError("Failed to delete a habit", 500, "Server Error");
  }
};

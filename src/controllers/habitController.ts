import type { Response } from "express";
import db from "../db/connection.ts";
import { habits, entries, habitTags, tags } from "../db/schema.ts";
import { type AuthenticatedRequest } from "../middlewares/authMiddleware.ts";
import { eq, and, desc, inArray } from "drizzle-orm";

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
    res.status(500).json({ error: "Server Error" });
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
    res.status(500).json({ error: "Error getting habits" });
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
      },
    });

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
    res.status(500).json({ error: "Error getting habits" });
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
        return res
          .status(401)
          .json({ message: "Error updating a habit" })
          .end();
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
    res.status(500).json({ error: "Failed to update the habit" });
  }
};

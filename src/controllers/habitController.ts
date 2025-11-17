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

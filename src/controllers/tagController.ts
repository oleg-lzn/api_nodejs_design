import { eq } from "drizzle-orm";
import db from "../db/connection.ts";
import { tags } from "../db/schema.ts";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.ts";
import { APIError } from "../middlewares/errorHandler.ts";

export const getTags = async (req: Request, res: Response) => {
  try {
    const allTags = await db.select().from(tags).orderBy(tags.name);

    res.json({
      tags: allTags,
    });
  } catch (error) {
    console.error("Get tags error:", error);
    throw new APIError("Failed to fetch tags", 500, "Server Error");
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await db.query.tags.findFirst({
      where: eq(tags.id, id),
      with: {
        habitTags: {
          with: {
            habit: {
              columns: {
                id: true,
                name: true,
                description: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!tag) {
      throw new APIError("Tag not found", 404, "Server Error");
    }

    // Transform the data
    const tagWithHabits = {
      ...tag,
      habits: tag.habitTags.map((ht) => ht.habit),
      habitTags: undefined,
    };

    res.json({
      tag: tagWithHabits,
    });
  } catch (error) {
    console.error("Get tag error:", error);
    throw new APIError("Failed to fetch a tag", 500, "Server Error");
  }
};

export const updateTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    // If updating name, check if new name already exists
    if (name) {
      const existingTag = await db.query.tags.findFirst({
        where: eq(tags.name, name),
      });

      if (existingTag && existingTag.id !== id) {
        throw new APIError(
          "Tag with this name already exists",
          409,
          "Server Error"
        );
      }
    }

    const [updatedTag] = await db
      .update(tags)
      .set({
        ...(name && { name }),
        ...(color && { color }),
        updatedAt: new Date(),
      })
      .where(eq(tags.id, id))
      .returning();

    if (!updatedTag) {
      throw new APIError("Tag not found", 404, "Server Error");
    }

    res.json({
      message: "Tag updated successfully",
      tag: updatedTag,
    });
  } catch (error) {
    console.error("Update tag error:", error);
    throw new APIError("Failed to update a tag", 500, "Server Error");
  }
};

export const deleteTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [deletedTag] = await db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning();

    if (!deletedTag) {
      throw new APIError("Tag not found", 404, "Server Error");
    }

    res.json({
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Delete tag error:", error);
    throw new APIError("Failed to delete a tag", 500, "Server Error");
  }
};

export const getPopularTags = async (req: Request, res: Response) => {
  try {
    // Get all tags with their usage count
    const tagsWithCount = await db.query.tags.findMany({
      with: {
        habitTags: true,
      },
    });

    // Transform and sort by usage count
    const popularTags = tagsWithCount
      .map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        usageCount: tag.habitTags.length,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10); // Top 10 most popular tags

    res.json({
      tags: popularTags,
    });
  } catch (error) {
    console.error("Get popular tags error:", error);
    throw new APIError("Failed to delete a tag", 500, "Server Error");
  }
};

export const createTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, color } = req.body;

    // Check if tag with same name already exists
    const existingTag = await db.query.tags.findFirst({
      where: eq(tags.name, name),
    });

    if (existingTag) {
      throw new APIError(
        "Tag with this name already exists",
        409,
        "Server Error"
      );
    }

    const [newTag] = await db
      .insert(tags)
      .values({
        name,
        color: color || "#6B7280", // Default gray color
      })
      .returning();

    res.status(201).json({
      message: "Tag created successfully",
      tag: newTag,
    });
  } catch (error) {
    console.error("Create tag error:", error);
    throw new APIError("Failed to create a tag", 500, "Server Error");
  }
};

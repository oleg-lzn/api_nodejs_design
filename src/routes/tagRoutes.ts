import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.ts";
import { validateBody, validateParams } from "../middlewares/validation.ts";
import {
  completeParamsSchema,
  createTagSchema,
  updateTagSchema,
} from "../middlewares/validation.ts";
import { z } from "zod";
import {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
  // getTagHabits,
  getPopularTags,
} from "../controllers/tagController.ts";

const router = Router();
router.use(authenticateToken);

// Get tags
router.get("/", getTags);

// Get popular tags
router.get("/popular", getPopularTags);

// Get tag by id
router.get("/:id", validateParams(completeParamsSchema), getTagById);

// Create a tag
router.post("/", validateBody(createTagSchema), createTag);

// Update a tag
router.put(
  "/:id",
  validateParams(completeParamsSchema),
  validateBody(updateTagSchema),
  updateTag
);

// Delete a tag
router.delete("/:id", validateParams(completeParamsSchema), deleteTag);

// Relationship routes
// router.get("/:id/habits", validateParams(completeParamsSchema), getTagHabits);

export default router;

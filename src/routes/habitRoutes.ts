import { Router } from "express";
import {
  createHabitSchema,
  validateBody,
  validateParams,
  completeParamsSchema,
  updateHabitSchema,
} from "../middlewares/validation.ts";
import { z } from "zod";
import { authenticateToken } from "../middlewares/authMiddleware.ts";
import {
  createHabit,
  deleteHabit,
  getHabits,
  getOneHabit,
  updateHabit,
} from "../controllers/habitController.ts";

const router = Router();
router.use(authenticateToken); // everything below runs an authenticate middleware

// Get all the habits
router.get("/", getHabits);

// Get one habit
router.get("/:id", validateParams(completeParamsSchema), getOneHabit);

// Create a habit
router.post("/", validateBody(createHabitSchema), createHabit);

// Update a habit
router.patch(
  "/:id",
  validateBody(updateHabitSchema),
  validateParams(completeParamsSchema),
  updateHabit
);

router.delete("/:id", validateParams(completeParamsSchema), deleteHabit);

router.post(
  "/:id/complete",
  validateBody(createHabitSchema),
  validateParams(completeParamsSchema),
  (req, res) => {
    res.status(200).json({
      message: "habitcompleted",
    });
  }
);

export default router;

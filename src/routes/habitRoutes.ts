import { Router } from "express";
import {
  createHabitSchema,
  validateBody,
  validateParams,
} from "../middlewares/validation.ts";
import { z } from "zod";
import { authenticateToken } from "../middlewares/authMiddleware.ts";
import { createHabit, getHabits } from "../controllers/habitController.ts";

const completeParamsSchema = z.object({
  id: z.string,
});

const router = Router();
router.use(authenticateToken); // everything below runs an authenticate middleware

// Get all the habits
router.get("/", getHabits);

router.get("/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    message: "success",
    data: "1 habit",
  });
});

// Create a habit
router.post("/", validateBody(createHabitSchema), createHabit);

router.delete("/:id", (req, res) => {
  res.status(204).json({
    message: "habit deleted",
  });
});

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

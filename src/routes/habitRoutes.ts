import { Router } from "express";
import { validateBody } from "../middlewares/inputMiddleware.ts";
import { z } from "zod";

const createHabitSchema = z.object({
  name: z.string(),
});

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "success",
    data: "something",
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    message: "success",
    data: "1 habit",
  });
});

router.post("/", validateBody(createHabitSchema), (req, res) => {
  res.status(201).json({
    message: "habit created",
  });
});

router.delete("/:id", (req, res) => {
  res.status(204).json({
    message: "habit deleted",
  });
});

router.post("/:id/complete", (req, res) => {
  res.status(200).json({
    message: "habitcompleted",
  });
});

export default router;

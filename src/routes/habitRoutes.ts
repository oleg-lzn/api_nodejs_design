import { Router } from "express";

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

router.post("/", (req, res) => {
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

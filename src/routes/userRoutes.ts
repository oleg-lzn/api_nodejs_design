import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Got all users",
    data: "all the users",
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    message: "success, got the user",
    data: "user's data",
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(201).json({
    message: "updated a user",
  });
});

router.delete("/:id", (req, res) => {
  res.status(204).json({
    message: "user deleted",
  });
});

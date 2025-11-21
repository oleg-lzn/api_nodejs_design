import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.ts";
import {
  getUser,
  changePassword,
  updateProfile,
  deleteUser,
} from "../controllers/userController.ts";
import {
  updateProfileSchema,
  validateBody,
  changePasswordSchema,
} from "../middlewares/validation.ts";

const router = Router();
router.use(authenticateToken);

// get 1 User
router.get("/user", getUser);

// Change the password
router.post(
  "/change-password",
  validateBody(changePasswordSchema),
  changePassword
);

// Update profile
router.put("/profile", validateBody(updateProfileSchema), updateProfile);

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

router.delete("/:id", deleteUser);

export default router;

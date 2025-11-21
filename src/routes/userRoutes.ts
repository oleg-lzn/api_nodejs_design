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
  validateParams,
  completeParamsSchema,
} from "../middlewares/validation.ts";

const router = Router();
router.use(authenticateToken);

// Get User
router.get("/user", getUser);

// Change the password
router.post(
  "/change-password",
  validateBody(changePasswordSchema),
  changePassword
);

// Update profile
router.put("/profile", validateBody(updateProfileSchema), updateProfile);

// Delete a user
router.delete("/:id", validateParams(completeParamsSchema), deleteUser);

export default router;

import z, { type ZodSchema, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

// General validation schemas ( requests )
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          message: "Nah. Body Validation failed",
          details: e.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(e);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          message: "Nah. Params Validation failed",
          details: e.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(e);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          message: "Nah. Query Params Validation failed",
          details: e.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(e);
    }
  };
};

// Validation schemas user
export const loginSchema = z.object({
  email: z.email("Invalid e-mail"),
  password: z.string().min(6, "Password is required"),
});

// Validation schemas habits

export const createHabitSchema = z.object({
  name: z.string(), // required
  description: z.string().optional(),
  frequency: z.string(), // required
  targetCount: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const completeParamsSchema = z.object({
  id: z.string(),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional().nullable(),
  frequency: z.string().min(1).max(50).optional(),
  targetCount: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

// Validation schemas profile
export const updateProfileSchema = z.object({
  email: z.string("Invalid email format").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username too long")
    .optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
});

// Validation schemas tags
export const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50, "Name too long"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color")
    .optional(),
});

export const updateTagSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color")
    .optional(),
});

export const uuidSchema = z.object({
  id: z.string().uuid("Invalid tag ID format"),
});

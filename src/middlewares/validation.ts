import z, { type ZodSchema, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

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

export const loginSchema = z.object({
  email: z.email("Invalid e-mail"),
  password: z.string().min(6, "Password is required"),
});

export const createHabitSchema = z.object({
  name: z.string(), // required
  description: z.string().optional(),
  frequency: z.string(), // required
  targetCount: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const completeParamsSchema = z.object({
  id: z.string,
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional().nullable(),
  frequency: z.string().min(1).max(50).optional(),
  targetCount: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

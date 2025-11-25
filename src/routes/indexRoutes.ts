import { Router } from "express";
import authRouter from "./authRoutes.ts";
import userRouter from "./userRoutes.ts";
import habitsRouter from "./habitRoutes.ts";
import tagRouter from "./tagRoutes.ts";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/users", userRouter);
mainRouter.use("/habits", habitsRouter);
mainRouter.use("/tags", tagRouter);

export default mainRouter;

import { Router } from "express";
import cookieParser from 'cookie-parser';
import * as controller from "../controllers/auth";

export const authRouter = Router();

authRouter.use(cookieParser());

authRouter.post("/register", controller.register);
authRouter.post("/login", controller.login);

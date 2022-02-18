import { Router } from "express";
import * as controller from "../controllers/auth";

export const auth = Router();

auth.post("/register", controller.register);
auth.post("/login", controller.login);

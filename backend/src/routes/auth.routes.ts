import { Router } from "express";
import {
  login,
  register,
  logout,
  refreshToken,
} from "@/controllers/authControllers/authControllers";
import schemaValidator from "@/middlewares/schemaValidator";
import { registerUserSchema, loginUserSchema } from "@/schema/auth.schema";
import isAuthenticated from "@/middlewares/isAuthenticated";

const router = Router();

router.post("/register", schemaValidator(registerUserSchema), register);
router.post("/login", schemaValidator(loginUserSchema), login);
router.post("/logout", isAuthenticated, logout);

router.post("/refresh-token", refreshToken);

export default router;

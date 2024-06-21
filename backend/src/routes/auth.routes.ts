import { Router } from "express";
import { login, register } from "@/controllers/authControllers/authControllers";
import schemaValidator from "@/middlewares/schemaValidator";
import { registerUserSchema, loginUserSchema } from "@/schema/auth.schema";

const router = Router();

router.post("/register", schemaValidator(registerUserSchema), register);
router.post("/login", schemaValidator(loginUserSchema), login);

export default router;

import { Router } from "express";
import { register } from "@/controllers/authControllers/authControllers";
import schemaValidator from "@/middlewares/schemaValidator";
import { registerUserSchema } from "@/schema/auth.schema";

const router = Router();

router.post("/register", schemaValidator(registerUserSchema), register);

export default router;

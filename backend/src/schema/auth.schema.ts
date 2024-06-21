import { isValidObjectId } from "mongoose";
import * as zod from "zod";

export const registerUserSchema = zod.object({
  body: zod
    .object({
      email: zod.string().email("Please provide a valid email address"),

      password: zod
        .string()
        .trim()
        .min(6, "Please provide a password with at least 6 characters")
        .max(20, "Please provide a password with at most 20 characters"),

      passwordConfirm: zod.string().min(1, "Please confirm your password"),

      firstName: zod.string().min(3).max(255).optional(),

      lastName: zod.string().min(3).max(255).optional(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    }),
});

export const loginUserSchema = zod.object({
  body: zod.object({
    email: zod.string().trim().email("Please provide a valid email address"),
    password: zod.string().trim().min(1, "Password cannot be empty"),
  }),
});

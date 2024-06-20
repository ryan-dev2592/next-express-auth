import { isValidObjectId } from "mongoose";
import * as zod from "zod";

export const registerUserSchema = zod.object({
  body: zod
    .object({
      username: zod
        .string()
        .trim()
        .min(3, "Please provide a username with at least 3 characters")
        .max(20, "Please provide a username with at most 20 characters"),

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

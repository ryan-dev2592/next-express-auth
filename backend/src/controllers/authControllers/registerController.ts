import { Response, RequestHandler, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { RegisterRequest } from "@/types/auth";
import createHttpError from "http-errors";
import User from "@/models/userModel";

const registerController: RequestHandler = expressAsyncHandler(
  async (req: RegisterRequest, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Check if all mandatory fields are provided
      if (!email || !password) {
        throw new createHttpError.BadRequest(
          "Please fill in all the required fields"
        );
      }

      // Check if the user already exists
      const userExists = await User.findOne({
        email: email.toLowerCase(),
      });

      if (userExists) {
        throw new createHttpError.Conflict(
          "User with the same email/username already exists"
        );
      }

      // Create a new user
      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
      });

      // Send Verification Email

      // Token Generation

      // Send the response
      res.status(201).json({
        message: "Please check your email to verify your account",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default registerController;

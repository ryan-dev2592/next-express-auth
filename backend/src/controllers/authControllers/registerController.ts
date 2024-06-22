import { Response, RequestHandler, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { RegisterRequest } from "@/types/auth";
import createHttpError from "http-errors";
import UserModel from "@/models/userModel";
import generateVerificationToken from "@/helpers/generateVericationToken";
import { createNewUser } from "@/services/user.service";
import EmailVerificationTokenModel from "@/models/emailVerificationTokenModel";
import { sendVerificationEMail } from "@/utils/sendEmail";

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
      const userExists = await UserModel.findOne({
        email: email.toLowerCase(),
      });

      if (userExists) {
        throw new createHttpError.Conflict(
          "User with the same email/username already exists"
        );
      }

      // Create a new user
      const user = await createNewUser(req.body);

      if (!user) {
        throw new createHttpError.InternalServerError(
          "User could not be created"
        );
      }

      // Email Token Generation
      const emailToken = generateVerificationToken();

      // Send Verification Email
      await EmailVerificationTokenModel.create({
        owner: user._id,
        token: emailToken,
      });

      // Send Verification Email
      await sendVerificationEMail(user, emailToken);

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

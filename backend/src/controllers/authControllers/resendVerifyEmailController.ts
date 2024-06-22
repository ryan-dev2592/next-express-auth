import { Response, RequestHandler, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { ResendVerifyEmailRequest } from "@/types/auth";
import { findUserByEmail } from "@/services/user.service";
import createHttpError from "http-errors";
import EmailVerificationTokenModel from "@/models/emailVerificationTokenModel";
import generateVerificationToken from "@/helpers/generateVericationToken";
import { sendVerificationEMail } from "@/utils/sendEmail";

const verifyEmailController: RequestHandler = expressAsyncHandler(
  async (req: ResendVerifyEmailRequest, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      // Check if the user exists
      const user = await findUserByEmail(email);

      if (!user) {
        throw new createHttpError.NotFound("User not found");
      }

      // Check if email is already verified
      if (user.isEmailVerified) {
        throw new createHttpError.BadRequest("Email is already verified");
      }

      // Clear the previous email verification token
      await EmailVerificationTokenModel.deleteOne({ owner: user.id });

      // Create a new email verification token
      const token = await generateVerificationToken();

      // Save the token
      await EmailVerificationTokenModel.create({
        owner: user.id,
        token,
      });

      // Send the email verification link
      await sendVerificationEMail(user, token);

      res.status(200).json({
        success: true,
        message: "Email verification link sent successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

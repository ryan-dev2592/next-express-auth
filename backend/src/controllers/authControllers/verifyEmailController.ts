import EmailVerificationTokenModel from "@/models/emailVerificationTokenModel";
import { findUserById } from "@/services/user.service";
import { Request, Response, RequestHandler, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";

const verifyEmailController: RequestHandler = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, token } = req.body;

      // Check if the user exists
      const user = await findUserById(id);

      if (!user) {
        throw new createHttpError.NotFound("User not found");
      }

      // Check if email is already verified
      if (user.isEmailVerified) {
        throw new createHttpError.BadRequest("Email is already verified");
      }

      // Check if the token is valid
      const tokenExists = await EmailVerificationTokenModel.findOne({
        owner: id,
      });

      if (!tokenExists) {
        throw new createHttpError.BadRequest("Token not found");
      }

      // Compare the token
      const isTokenValid = await tokenExists.compareToken(token);

      if (!isTokenValid) {
        throw new createHttpError.BadRequest("Token is invalid");
      }

      // Check if the token is expired
      if (tokenExists.expiresAt < new Date()) {
        throw new createHttpError.BadRequest(
          "Token expired, kindly request a new one"
        );
      }

      // Update the user's email verification status
      user.isEmailVerified = true;
      await user.save();

      // Delete the token
      await EmailVerificationTokenModel.deleteOne({ owner: id });

      res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default verifyEmailController;

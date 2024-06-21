import { Response, NextFunction, RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { LoginRequest } from "@/types/auth";
import createHttpError from "http-errors";
import { generateTokens } from "@/services/token.service";
import { checkUserCredentials } from "@/services/auth.service";

const loginController: RequestHandler = expressAsyncHandler(
  async (req: LoginRequest, res: Response, next: NextFunction) => {
    try {
      const refreshTokenFromCookies: string = req.cookies.refreshToken;

      const { email, password } = req.body;

      if (!email || !password) {
        throw new createHttpError.BadRequest(
          "Please provide email and password"
        );
      }

      const user = await checkUserCredentials(email, password);

      if (!user) {
        throw new createHttpError.Unauthorized("Invalid credentials");
      }

      // Check if user is verified
      if (!user.isEmailVerified) {
        throw new createHttpError.Unauthorized(
          "Please verify your email to login"
        );
      }

      const { accessToken, refreshToken } = await generateTokens(user);

      let newRefreshTokenArray: string[] = [];

      // Check if user has refresh Token from cookies
      if (refreshTokenFromCookies) {
        // Filter out the refresh token from the database that matches the refresh token from the cookies
        newRefreshTokenArray = user.refreshTokens.filter(
          (token: string) => token !== refreshTokenFromCookies
        );

        newRefreshTokenArray.push(refreshToken);
        // Add the new refresh token to the array
      } else {
        // If user does not have refresh token from cookies then add the new refresh token to the array
        newRefreshTokenArray = [...user.refreshTokens, refreshToken];
      }

      // If user already has 10 refresh tokens then remove the oldest one
      if (newRefreshTokenArray.length > 10) {
        newRefreshTokenArray.shift();
      }

      // Update user refresh tokens
      user.refreshTokens = newRefreshTokenArray;

      await user.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.HTTPONLY_SECURE === "true" ? true : false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      // Remove password from user object
      // const userObj = createUserObjWithoutPassword(user);

      // Send new access token to client
      res.status(200).json({
        message: "Login successful",
        data: {
          user: user.toJSON(),
          accessToken: accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default loginController;

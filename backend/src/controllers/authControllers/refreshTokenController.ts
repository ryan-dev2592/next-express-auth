import {
  generateTokens,
  refreshTokenReuseDetection,
  verifyRefreshToken,
} from "@/services/token.service";
import { findUserByRefreshToken } from "@/services/user.service";
import { Request, Response, RequestHandler, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";

const refreshTokenController: RequestHandler = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshTokenFromCookies: string = req.cookies.refreshToken;

      if (!refreshTokenFromCookies) {
        throw new createHttpError.BadRequest("Refresh token not found");
      }

      // Clear cookies
      res.clearCookie("refreshToken", { httpOnly: true });

      // Find user by refresh token
      const userFound = await findUserByRefreshToken(refreshTokenFromCookies);

      console.log("User Found with refresh token: ", userFound);

      if (!userFound) {
        console.log("User not found with refresh token, reuse detection");

        // Reuse Detection
        await refreshTokenReuseDetection(refreshTokenFromCookies);

        throw new createHttpError.Forbidden("Invalid Token");
      }

      // Remove refresh token from user
      const newRefreshTokenArray = userFound.refreshTokens.filter(
        (token: string) => token !== refreshTokenFromCookies
      );

      // Check if refresh token is valid
      const decodedToken = await verifyRefreshToken(refreshTokenFromCookies);

      if (!decodedToken) {
        throw new createHttpError.Forbidden("Invalid Token");
      }

      // Generate new tokens
      const { accessToken, refreshToken } = await generateTokens(userFound);

      // Update user refresh tokens
      userFound.refreshTokens = [...newRefreshTokenArray, refreshToken];
      await userFound.save();

      // Send refresh token in cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default refreshTokenController;

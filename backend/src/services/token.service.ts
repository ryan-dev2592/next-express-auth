import jwt from "jsonwebtoken";

import User, { IUserDocument } from "@/models/userModel";
import {
  ACCESS_JWT_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_JWT_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "@/utils/variables";

// Generate Access Token and Refresh Token
export const generateTokens = async (user: IUserDocument) => {
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { accessToken, refreshToken };
};

// Refresh Token Generation

const generateRefreshToken = async (user: IUserDocument) => {
  const refreshToken = await jwt.sign(
    { id: user.id, email: user.email },
    REFRESH_JWT_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      algorithm: "HS256",
      encoding: "utf-8",
    }
  );

  return refreshToken;
};

// Access Token Generation

const generateAccessToken = async (user: IUserDocument) => {
  const accessToken = await jwt.sign(
    { id: user.id, email: user.email },
    ACCESS_JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      algorithm: "HS256",
      encoding: "utf-8",
    }
  );

  return accessToken;
};

// Remove Refresh Token

//

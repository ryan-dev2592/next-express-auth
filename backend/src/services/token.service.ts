import jwt, { CustomJWTPayload } from "jsonwebtoken";

import { IUserDocument } from "@/models/userModel";
import {
  ACCESS_JWT_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_JWT_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "@/utils/variables";
import { findUserById } from "./user.service";

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

// Verify Access Token
export const verifyAccessToken = async (token: string) => {
  try {
    const decodedToken = <jwt.CustomJWTPayload>(
      jwt.verify(token, ACCESS_JWT_SECRET)
    );
    return decodedToken;
  } catch (error) {
    return null;
  }
};

// Verify Refresh Token

export const verifyRefreshToken = async (token: string) => {
  try {
    const decodedToken = <jwt.CustomJWTPayload>(
      jwt.verify(token, REFRESH_JWT_SECRET)
    );
    return decodedToken;
  } catch (error) {
    return null;
  }
};

// Remove Refresh Token

// Refresh Token Reuse Detection

export const refreshTokenReuseDetection = async (refreshToken: string) => {
  const decodedToken = await verifyRefreshToken(refreshToken);

  if (!decodedToken) {
    return null;
  }

  const decodedUser = await findUserById(decodedToken.id);

  console.log("Decoded User: ", decodedUser);

  if (!decodedUser) return null;

  decodedUser.refreshTokens = [];

  await decodedUser.save();

  return null;
};

import { Request, Response, RequestHandler, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { ACCESS_JWT_SECRET } from "@/utils/variables";
import { verifyAccessToken } from "@/services/token.service";
import { findUserById } from "@/services/user.service";

const isAuthenticated: RequestHandler = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token || token === "") {
      throw new createHttpError.Unauthorized("Token not found");
    }

    try {
      const decodedToken = await verifyAccessToken(token);

      if (!decodedToken) {
        throw new createHttpError.Unauthorized("Invalid Token");
      }

      const user = await findUserById(decodedToken.id);

      if (!user) {
        throw new createHttpError.Unauthorized("User not found");
      }

      req.user = user;
    } catch (error) {
      throw new createHttpError.Unauthorized("Invalid Token");
    }
  }
);

export default isAuthenticated;

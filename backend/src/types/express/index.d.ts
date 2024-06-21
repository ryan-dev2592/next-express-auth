import { IUserDocument } from "@/models/userModel";
import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      user: IUserDocument;
    }
  }
}

declare module "jsonwebtoken" {
  export interface CustomJWTPayload extends jwt.JwtPayload {
    id: string;
    email: string;
  }
}

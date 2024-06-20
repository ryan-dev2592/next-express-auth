import { Request } from "express";

export interface RegisterRequest extends Request {
  body: {
    firstName?: string;
    lastName?: string;
    email: string;
    username: string;
    password: string;
  };
}

import { Request } from "express";

export interface RegisterRequest extends Request {
  body: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface ResendVerifyEmailRequest extends Request {
  body: {
    email: string;
  };
}

export interface VerifyEmailRequest extends Request {
  body: {
    id: string;
    token: string;
  };
}

export interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

export interface ResetPasswordRequest extends Request {
  body: {
    id: string;
    token: string;
    newPassword: string;
  };
}

export interface ChangePasswordRequest extends Request {
  body: {
    currentPassword: string;
    newPassword: string;
  };
}

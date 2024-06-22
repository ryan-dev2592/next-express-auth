import dotenv from "dotenv";

dotenv.config();

const { env } = process as { env: { [key: string]: string } };

export const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_JWT_SECRET,
  ACCESS_JWT_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  CLIENT_URL,
  EMAIL_FROM,
} = env;

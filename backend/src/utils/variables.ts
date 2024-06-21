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
} = env;

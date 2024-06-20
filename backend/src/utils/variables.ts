import dotenv from "dotenv";

dotenv.config();

const { env } = process as { env: { [key: string]: string } };

export const { PORT, NODE_ENV, MONGO_URI } = env;

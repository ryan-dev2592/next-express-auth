import mongoose from "mongoose";
import { MONGO_URI } from "@/utils/variables";
import logger from "../logger.config";

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI, {});
    logger.info("Connected to database");
  } catch (error) {
    logger.error("Error connecting to database: ", error);
  }
};

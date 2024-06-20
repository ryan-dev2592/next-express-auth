import app from "@/app";

import { createServer } from "http";
import { PORT } from "@/utils/variables";
import { connectDb } from "@/config/db/connectDb";
import logger from "@/config/logger.config";

connectDb()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error);
  });

let server = createServer(app);

server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

// Exit process on unhandled promise rejection
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on("unhandledRejection", unexpectedErrorHandler);
process.on("uncaughtException", unexpectedErrorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
    logger.info("Server closed");
    process.exit(1);
  }
});

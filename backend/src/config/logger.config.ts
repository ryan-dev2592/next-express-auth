// Logger configuration using winston

import { NODE_ENV } from "@/utils/variables";
import { createLogger, format, transports } from "winston";

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = createLogger({
  level: NODE_ENV === "development" ? "debug" : "info",
  format: format.combine(
    enumerateErrorFormat(),
    NODE_ENV === "development" ? format.colorize() : format.uncolorize(),
    format.splat(),
    format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import createHttpError from "http-errors";
import errorHandler from "@/middlewares/errorHandler";

import routes from "@/routes";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Not Found Route
app.use(async (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError.NotFound("Route not found"));
});

// Error Handler
app.use(errorHandler);

export default app;

import { Request, Response, NextFunction } from "express";

const errorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = error.status || 500;

  if (status === 200) {
    status = 500;
  }

  res.status(status).json({
    error: {
      status,
      message: error.message,
    },
  });
};

export default errorHandler;

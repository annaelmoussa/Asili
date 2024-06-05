import { NextFunction, Request, Response } from "express";

interface HttpError extends Error {
  status?: number;
}

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status ?? 500;
  const message = err.message || "Something went wrong";

  console.error(`[Error] ${status} - ${message}`);

  res.status(status).json({
    status: "error",
    statusCode: status,
    message,
  });
};

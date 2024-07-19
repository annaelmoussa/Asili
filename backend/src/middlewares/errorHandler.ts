import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";

interface HttpError extends Error {
  status?: number;
}

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = err.status ?? 500;
  let message = err.message || "Something went wrong";

  if (err instanceof UnauthorizedError) {
    status = err.status;
    message = err.message;
  }

  console.error(`[Error] ${status} - ${message}`);

  res.status(status).json({
    status: "error",
    statusCode: status,
    message,
  });
};

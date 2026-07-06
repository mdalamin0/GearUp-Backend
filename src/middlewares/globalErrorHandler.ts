import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"

const globalErrorHanlder = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.stack
  });
};

export default globalErrorHanlder;

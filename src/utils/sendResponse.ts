import type { Response } from "express";
import httpStatus from "http-status"

const sendResponse = <T>(
  res: Response,
  { message, data, error }: { message: string; data?: T; error?: boolean },
  status = httpStatus.OK,
) => {
  res.status(status).json({
    success: error ? false : true,
    message: message,
    data: error ? undefined : data,
  });
};

export default sendResponse;

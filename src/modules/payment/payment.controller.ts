import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentServices } from "./payment.service";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";

const initiatePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { id } = req.params;

    const result = await paymentServices.initiatePayment(
      id as string,
      user as JwtPayload,
    );

    sendResponse(res, {
      message: "Payment initiate successfully",
      data: result,
    });
  },
);

export const paymentController = {
  initiatePayment,
};

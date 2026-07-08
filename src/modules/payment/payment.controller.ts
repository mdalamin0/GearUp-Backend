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
    },201);
  },
);

const verifyPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, tranId, status } = req.query;

    const payload = req.body;

    const response = await paymentServices.verifyPayment(
      orderId as string,
      tranId as string,
      status as string,
      payload,
    );

    if (response === "success") {
      res.status(200).json({
        success: true,
        paymentStatus: "PAID",
        message: "Payment successful",
      });
    } else if (response === "failed") {
      return res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    } else if (response === "cancel") {
      return res.status(400).json({
        success: false,
        message: "Payment cancelled",
      });
    }
  },
);

const getUsersPaymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await paymentServices.getUsersPaymentHistory(
      userId as string,
    );
    sendResponse(res, {
      message: "Payment history retrive successfully.",
      data: result,
    });
  },
);

export const paymentController = {
  initiatePayment,
  verifyPayment,
  getUsersPaymentHistory,
};

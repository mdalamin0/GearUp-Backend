import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewServices } from "./review.service";
import sendResponse from "../../utils/sendResponse";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const payload = req.body;

    if(!payload.gearItemId || !payload.rating || !payload.comment){
      throw new Error("Gear item id, raing and comment are required.")
    }

    const result = await reviewServices.createReviewIntoDB(
      customerId as string,
      payload,
    );

    sendResponse(
      res,
      { message: "Review created successfully.", data: result },
      201,
    );
  },
);

export const reviewController = {
  createReview,
};

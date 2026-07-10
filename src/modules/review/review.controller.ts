import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewServices } from "./review.service";
import sendResponse from "../../utils/sendResponse";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const payload = req.body;

    if (!payload.gearItemId || !payload.rating || !payload.comment) {
      throw new Error("Gear item id, raing and comment are required.");
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

const getReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await reviewServices.getReviews(id as string);
    sendResponse(res, {
      message: "Reviews retrived successfully.",
      data: result,
    });
  },
);

const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const { id } = req.params;
    const payload = req.body;

    const result = await reviewServices.updateReview(
      id as string,
      customerId as string,
      payload,
    );

    sendResponse(res, {
      message: "Review updated successfully.",
      data: result,
    });
  },
);

const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const customerId = req.user?.id;

    await reviewServices.deleteReview(id as string, customerId as string);

    sendResponse(res, {message: "Review deleted successfully."})
  },
);

export const reviewController = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
};

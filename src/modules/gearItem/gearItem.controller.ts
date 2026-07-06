import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearItemServices } from "./gearItem.service";
import sendResponse from "../../utils/sendResponse";

const createGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id;
    const payload = req.body;

    const result = await gearItemServices.createGearItemIntoDB(
      payload,
      providerId as string,
    );

    sendResponse(
      res,
      { message: "Gear Item created successfully!", data: result },
      201,
    );
  },
);

export const gearItemController = {
  createGearItem,
};

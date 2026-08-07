import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { homeServices } from "./home.service";

const getAllStatsData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await homeServices.getHomeStatsFromDB();

    sendResponse(res, { message: "Stats retrive successfully", data: result });
  },
);



export const homeController = {
  getAllStatsData
}
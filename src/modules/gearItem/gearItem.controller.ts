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

const getAllGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await gearItemServices.getAllGearFromDB(query);

    sendResponse(res, { message: "Gears retrive successfully", data: result });
  },
);

const getSingleGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new Error("Gear item id is required");
    }
    const result = await gearItemServices.getSingleGearItemFromDB(id as string);

    sendResponse(res, {
      message: "Single gear item retrive successfully.",
      data: result,
    });
  },
);

const updateGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const providerId = req.user?.id;
    const payload = req.body;

    const result = await gearItemServices.updateGearItemIntoDB(
      id as string,
      providerId as string,
      payload,
    );

    sendResponse(res, { message: "Gear updated successfully.", data: result });
  },
);

const deleteGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const providerId = req.user?.id;

    await gearItemServices.deleteGearFromDB(id as string, providerId as string);

    sendResponse(res, {message: "Gear deleted successfully."})
  },
);

export const gearItemController = {
  createGearItem,
  getAllGear,
  getSingleGearItem,
  updateGearItem,
  deleteGear,
};

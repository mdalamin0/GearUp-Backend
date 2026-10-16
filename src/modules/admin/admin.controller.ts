import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import sendResponse from "../../utils/sendResponse";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await adminService.getAllUsers(query);

    sendResponse(res, { message: "Users retrive successfully.", data: result });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await adminService.updateUserStatus(id as string, status);

    sendResponse(res, {
      message: "Status updated successfully.",
      data: result,
    });
  },
);

const updateGearFeatured = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { isFeatured } = req.body;

   if (isFeatured === undefined) {
     throw new Error("isFeatured is required.");
   }
   
   if (typeof isFeatured !== "boolean") {
     throw new Error("isFeatured must be a boolean.");
   }

    const result = await adminService.updateGearFeatured(
      id as string,
      isFeatured,
    );

    sendResponse(res, {
      message: `Gear ${
        result.isFeatured ? "featured" : "removed from featured"
      } successfully.`,
      data: result,
    });
  },
);

const getAllGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await adminService.getAllGears(query);

    sendResponse(res, { message: "Gears retrive successfully.", data: result });
  },
);

const getAllRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
    const result = await adminService.getAllRentals(query);

    sendResponse(res, {
      message: "Reantal orders retrive successfully.",
      data: result,
    });
  },
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  updateGearFeatured,
  getAllGears,
  getAllRentals,
};

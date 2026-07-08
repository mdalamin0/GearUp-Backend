import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import sendResponse from "../../utils/sendResponse";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsers();

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

const getAllGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllGears();

    sendResponse(res, { message: "Gears retrive successfully.", data: result });
  },
);

const getAllRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRentals();

    sendResponse(res, {
      message: "Reantal orders retrive successfully.",
      data: result,
    });
  },
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGears,
  getAllRentals,
};

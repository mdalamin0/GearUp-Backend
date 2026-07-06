import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;


    if(!payload.name || !payload.email || !payload.password){
      throw new Error("name, email and password are required")
    }

    const result = await authServices.createUserIntoDB(payload);

    sendResponse(res, {message: "Register successfully!", data: result})
  },
);

export const authController = {
  createUser
}

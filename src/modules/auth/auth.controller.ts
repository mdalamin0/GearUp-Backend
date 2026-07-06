import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    if (!payload.name || !payload.email || !payload.password) {
      throw new Error("name, email and password are required");
    }

    const result = await authServices.createUserIntoDB(payload);

    sendResponse(res, { message: "Register successfully!", data: result }, 201);
  },
);

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and Password are required.");
    }

    const { accessToken, refreshToken } = await authServices.loginUserIntoDB(
      email,
      password,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
    });

    sendResponse(res, {
      message: "User logged in successfully!",
      data: { accessToken, refreshToken },
    });
  },
);

const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await authServices.getCurrentUserFromDB(userId as string);

    sendResponse(res, {message: "User data retrive successfully.", data: result})
  },
);

export const authController = {
  createUser,
  loginUser,
  getCurrentUser
};

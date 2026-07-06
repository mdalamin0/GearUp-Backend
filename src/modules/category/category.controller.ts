import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryServices } from "./category.service";
import sendResponse from "../../utils/sendResponse";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    if (!name) {
      throw new Error(
        "Category name is required. Please provide category name",
      );
    }

    const result = await categoryServices.createCategoryIntoDB(name);

    sendResponse(
      res,
      { message: "Category created successfully.", data: result },
      201,
    );
  },
);

const getCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryServices.getCategoriesFromDB();

    sendResponse(res, {
      message: "Category retrive successfully.",
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;


    if (!name) {
      throw new Error("Updated name required.");
    }

    const result = await categoryServices.updateCategoryIntoDB(
      name,
      id as string,
    );

    sendResponse(res, {message: "Category updated successfully.", data: result})
  },
);

export const categoryController = {
  createCategory,
  getCategories,
  updateCategory,
};

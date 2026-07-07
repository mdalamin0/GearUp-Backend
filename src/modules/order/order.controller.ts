import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { orderServices } from "./order.service";
import sendResponse from "../../utils/sendResponse";

const creatOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const payload = req.body;

    const result = await orderServices.creatOrderIntoDB(
      payload,
      customerId as string,
    );

    sendResponse(
      res,
      { message: "Order created successfully!", data: result },
      201,
    );
  },
);

const getCustomerOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const result = await orderServices.getCustomerOrders(customerId as string);

    sendResponse(res, {
      message: "Orders retrive successfully.",
      data: result,
    });
  },
);

const getSingleOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const  {id}  = req.params;

    const result = await orderServices.getSingleOrderFromDB(
      id as string ,
      customerId as string,
    );

    sendResponse(res, {
      message: "Single order details retrive successfully.",
      data: result,
    });
  },
);

const getProviderOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id;

    const result = await orderServices.getProviderOrdersFromDB(providerId as string);

    sendResponse(res, {message: "Orders retrive successfully.", data: result})
  },
);

const updateOrderStatus = catchAsync(async (req, res) => {
  const providerId = req.user?.id;
  const { id } = req.params;
  const { status } = req.body;

  const result = await orderServices.updateOrderStatus(
    providerId as string,
    id as string,
    status,
  );

  sendResponse(res, {
    message: "Order status updated successfully.",
    data: result,
  });
});

export const orderController = {
  creatOrder,
  getCustomerOrders,
  getSingleOrder,
  getProviderOrders,
  updateOrderStatus
};

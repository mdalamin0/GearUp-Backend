import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { OrderPayload } from "./order.interface";

const creatOrderIntoDB = async (payload: OrderPayload, customerId: string) => {
  const { gearItemId, quantity, startDate, endDate } = payload;

  const convertedStartDate = new Date(startDate);
  const convertedEndDate = new Date(endDate);

  if (
    isNaN(convertedStartDate.getTime()) ||
    isNaN(convertedEndDate.getTime())
  ) {
    throw new Error("Invalid date format");
  }

  if (convertedStartDate >= convertedEndDate) {
    throw new Error("End date must be after start date");
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearItemId,
    },
  });

  if (!gear) {
    throw new Error("Gear item not found.");
  }

  if (gear.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  const totalDays = Math.ceil(
    (convertedEndDate.getTime() - convertedStartDate.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const totalAmount = Number(gear.rentalPrice) * quantity * totalDays;

  const result = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.rentalOrder.create({
      data: {
        gearItemId,
        customerId,
        quantity,
        totalAmount,
        startDate: convertedStartDate,
        endDate: convertedEndDate,
      },
    });

    await tx.gearItem.update({
      where: {
        id: gearItemId,
      },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return createdOrder;
  });

  return result;
};

const getCustomerOrders = async (customerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    include: {
      gearItem: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

const getSingleOrderFromDB = async (orderId: string, customerId: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: orderId,
    },
    include: {
      gearItem: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.customerId !== customerId) {
    throw new Error("Forbidden. You are not the owner of this order.");
  }

  return order;
};

const getProviderOrdersFromDB = async (providerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: {
      gearItem: {
        providerId,
      },
    },
    include: {
      customer: true,
      gearItem: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

const updateOrderStatus = async (
  providerId: string,
  orderId: string,
  status: OrderStatus,
) => {
  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: orderId,
    },
    include: {
      gearItem: true,
    },
  });

  if (!order) {
    throw new Error("Order not found!");
  }

  if (order.gearItem.providerId !== providerId) {
    throw new Error("Forbidden. You are not the owner of this gear.");
  }

  const updatedOrder = await prisma.rentalOrder.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });

  return updatedOrder;
};

export const orderServices = {
  creatOrderIntoDB,
  getCustomerOrders,
  getSingleOrderFromDB,
  getProviderOrdersFromDB,
  updateOrderStatus,
};

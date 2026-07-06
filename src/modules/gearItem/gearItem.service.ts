import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateGearItem } from "./gearItem.interface";

const createGearItemIntoDB = async (
  payload: ICreateGearItem,
  providerId: string,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found. Please provide valid category id");
  }

  const existItem = await prisma.gearItem.findFirst({
    where: {
      title: payload.title,
      providerId,
    },
  });

  if (existItem) {
    throw new Error("This gear item already exists");
  }

  if (payload.stock < 1) {
    throw new Error("Stock must be at least 1");
  }
  if (payload.rentalPrice <= 0) {
    throw new Error("Rental price must be greater than 0");
  }
  const item = await prisma.gearItem.create({
    data: {
      ...payload,
      specifications: payload.specifications as Prisma.InputJsonValue,
      providerId,
    },
  });
  return item;
};

export const gearItemServices = {
  createGearItemIntoDB,
};

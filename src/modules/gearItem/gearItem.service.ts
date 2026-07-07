import { Prisma } from "../../../generated/prisma/client";
import { GearItemWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreateGearItem,
  IGearItemsQuery,
  IUpdateGearPayload,
} from "./gearItem.interface";

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

const getAllGearFromDB = async (query: IGearItemsQuery) => {
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: GearItemWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          brand: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.brand) {
    andConditions.push({
      brand: {
        equals: query.brand,
        mode: "insensitive",
      },
    });
  }

  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      rentalPrice: {
        ...(query.minPrice && {
          gte: Number(query.minPrice),
        }),
        ...(query.maxPrice && {
          lte: Number(query.maxPrice),
        }),
      },
    });
  }

  if (query.available) {
    andConditions.push({
      stock: query.available === "true" ? { gt: 0 } : 0,
    });
  }

  if (query.category) {
    andConditions.push({
      category: {
        name: {
          equals: query.category,
          mode: "insensitive",
        },
      },
    });
  }

  const gears = await prisma.gearItem.findMany({
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      category: true,
    },
  });

  return gears;
};

const getSingleGearItemFromDB = async (id: string) => {
  const item = await prisma.gearItem.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!item) {
    throw new Error("Gear Item not found!");
  }

  return item;
};

const updateGearItemIntoDB = async (
  id: string,
  providerId: string,
  payload: IUpdateGearPayload,
) => {
  const { specifications, categoryId, ...restPayload } = payload;

  const item = await prisma.gearItem.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    throw new Error("Item not found!");
  }

  if (item.providerId !== providerId) {
    throw new Error("Forbidden. You are not the owner of this gear.");
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new Error("Category not found!");
    }
  }

  if (payload.rentalPrice !== undefined && payload.rentalPrice <= 0) {
    throw new Error("Rental price must be greater than 0");
  }

  if (payload.stock !== undefined && payload.stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const updatedGear = await prisma.gearItem.update({
    where: {
      id,
    },
    data: {
      ...restPayload,

      ...(specifications && {
        specifications: specifications as Prisma.InputJsonValue,
      }),

      ...(categoryId && {
        categoryId,
      }),
    },
  });

  return updatedGear;
};

const deleteGearFromDB = async (id: string, providerId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id,
    },
  });

  if (!gear) {
    throw new Error("Gear Item not found.");
  }

  if (gear.providerId !== providerId) {
    throw new Error("Forbidden. You are not the owner of this gear.");
  }

  await prisma.gearItem.delete({
    where: {
      id,
    },
  });
};

export const gearItemServices = {
  createGearItemIntoDB,
  getAllGearFromDB,
  getSingleGearItemFromDB,
  updateGearItemIntoDB,
  deleteGearFromDB,
};

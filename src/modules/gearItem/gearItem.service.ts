import { Prisma } from "../../../generated/prisma/client";
import { GearItemWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ICreateGearItem, IGearItemsQuery } from "./gearItem.interface";

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
      category: true
    }
  });

  return gears;
};

export const gearItemServices = {
  createGearItemIntoDB,
  getAllGearFromDB,
};

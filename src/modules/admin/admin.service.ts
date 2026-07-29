import { Role, UserStatus } from "../../../generated/prisma/enums";
import { GearItemWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IGearItemsQuery } from "../gearItem/gearItem.interface";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: Role.ADMIN,
      },
    },
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  if (user.status === status) {
    throw new Error("Status already updated.");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const updateGearFeatured = async (gearId: string, isFeatured: boolean) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new Error("Gear not found!");
  }

  if (gear.isFeatured === isFeatured) {
    throw new Error(
      `Gear is already ${isFeatured ? "featured" : "not featured"}.`,
    );
  }

  const updatedGear = await prisma.gearItem.update({
    where: {
      id: gearId,
    },
    data: {
      isFeatured,
      featuredAt: isFeatured ? new Date() : null,
    },
  });

  return updatedGear;
};

const getAllGears = async (query: IGearItemsQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
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
  if (query.isFeatured) {
    andConditions.push({
      isFeatured: true,
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

  const totalGears = await prisma.gearItem.count({
    where: {
      AND: andConditions,
    },
  });

  const gears = await prisma.gearItem.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,
    include: {
      provider: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return {
    data: gears,
    meta: {
      page: page,
      limit: limit,
      total: totalGears,
      totalPages: Math.ceil(totalGears / limit),
    },
  };
};

const getAllRentals = async () => {
  const rentals = await prisma.rentalOrder.findMany({
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
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

  return rentals;
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  updateGearFeatured,
  getAllGears,
  getAllRentals,
};

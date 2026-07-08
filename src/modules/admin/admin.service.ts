import { Role, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

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

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
  });

  return updatedUser;
};

export const adminService = {
  getAllUsers,
  updateUserStatus
};

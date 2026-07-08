import { Role } from "../../../generated/prisma/enums";
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
      createdAt: "desc"
    }
  });

  return users
};

export const adminService = {
  getAllUsers,
};

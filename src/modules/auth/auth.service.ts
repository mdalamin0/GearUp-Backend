import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ICreateUser } from "./auth.interface";
import config from "../../config";

const createUserIntoDB = async (payload: ICreateUser) => {
  const { name, email, password, role } = payload;

  const allowedRoles = ["CUSTOMER", "PROVIDER"];

  if (role && !allowedRoles.includes(role)) {
    throw new Error("Invalid role. Only CUSTOMER or PROVIDER is allowed");
  }

  const isExistUser = await prisma.user.findUnique({
    where: {
      email
    },
  });

  if (isExistUser) {
    throw new Error("User already exist with this email");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role,
    },
    omit: {
      password: true,
    },
  });

  return createdUser;
};

export const authServices = {
  createUserIntoDB,
};

import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ICreateUser } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const createUserIntoDB = async (payload: ICreateUser) => {
  const { name, email, password, role } = payload;

  const allowedRoles = ["CUSTOMER", "PROVIDER"];

  if (role && !allowedRoles.includes(role)) {
    throw new Error("Invalid role. Only CUSTOMER or PROVIDER is allowed");
  }

  const isExistUser = await prisma.user.findUnique({
    where: {
      email,
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

const loginUserIntoDB = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });


  if (!user) {
    throw new Error("User not found! Please register.");
  }

  if (user.status === "SUSPENDED") {
    throw new Error("Your account has been suspended. Please contact support!");
  }

   const matchPassword = await bcrypt.compare(password, user?.password!);

   if (!matchPassword) {
     throw new Error("Password is incorect!");
   }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {accessToken, refreshToken}
};

export const authServices = {
  createUserIntoDB,
  loginUserIntoDB,
};

import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ICreateUser, IGoogleLoginPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";
import { googleClient } from "../../lib/googleAuth";
import { TokenPayload } from "google-auth-library";
import { AuthProvider, Role, UserStatus } from "../../../generated/prisma/enums";

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

  if (user.password === null && user.googleId !== null) {
    throw new Error(
      "User Already Has Account Registered With Google. Try To Login With Google.",
    );
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

  return { accessToken, refreshToken };
};

const googleLogin = async (payload: IGoogleLoginPayload) => {
 
  let googleIdTokenPayload = null;

  // 1. Verify Google ID Token
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config.google_client_id,
    });

    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google ID Token Verification Failed", error);
    throw new Error("Invalid or expired Google ID token");
  }

  if (!googleIdTokenPayload) {
    throw new Error("Invalid or expired Google ID token");
  }

  if (!googleIdTokenPayload.name) {
    throw new Error("Google user name not found");
  }

  if (!googleIdTokenPayload.email) {
    throw new Error("Google email not found");
  }

  // 2. Check if this Google account already exists
  const existingGoogleUser = await prisma.user.findFirst({
    where: {
      email: googleIdTokenPayload.email,
      role: Role.CUSTOMER,
      googleId: googleIdTokenPayload.sub,
    },
  });

  let user = existingGoogleUser;

  // 3. If Google user doesn't exist
  if (!existingGoogleUser) {
    // Check if this email already exists with normal credentials
    const existingCredentialsUser = await prisma.user.findFirst({
      where: {
        email: googleIdTokenPayload.email,
        authProvider: AuthProvider.CREDENTIALS,
      },
    });

    // 4. Existing normal user → connect Google account
    if (existingCredentialsUser) {
      if (existingCredentialsUser.status === UserStatus.SUSPENDED) {
        throw new Error("User is suspended");
      }

      user = await prisma.user.update({
        where: {
          id: existingCredentialsUser.id,
        },
        data: {
          googleId: googleIdTokenPayload.sub,
          emailVerified: true,
        },
      });
    }

    // 5. Completely new Google user → create CUSTOMER
    else {
      user = await prisma.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email: googleIdTokenPayload.email,
          role: Role.CUSTOMER,
          googleId: googleIdTokenPayload.sub,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
        },
      });
    }
  }

  // 6. Make sure user exists
  if (!user) {
    throw new Error("User not found!");
  }

  // 7. Check account status
  if (user.status === UserStatus.SUSPENDED) {
    throw new Error("User is suspended");
  }

  // 8. Create JWT payload
  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // 9. Create Access Token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  // 10. Create Refresh Token
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getCurrentUserFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const authServices = {
  createUserIntoDB,
  loginUserIntoDB,
  googleLogin,
  getCurrentUserFromDB,
};

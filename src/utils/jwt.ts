import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const createToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
};

export const jwtUtils = {
  createToken
}

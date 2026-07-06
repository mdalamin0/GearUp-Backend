import { Role } from "../../../generated/prisma/enums";

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

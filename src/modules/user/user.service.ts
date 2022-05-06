import prisma from "../../configs/db";
import { User, Prisma as PTypes } from "@prisma/client";

class UserService {
  constructor() {}

  // Methods for creating User

  async addOne(data: PTypes.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  // Methods for get User information

  async getAll(args: PTypes.UserFindManyArgs): Promise<Array<User>> {
    return prisma.user.findMany(args);
  }

  async getById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id_: id } });
  }
}

export default UserService;

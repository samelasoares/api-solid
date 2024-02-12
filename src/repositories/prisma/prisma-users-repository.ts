import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id_user: string) {
    const users = await prisma.users.findUnique({
      where: {
        id_user,
      },
    });
    return users;
  }

  async findByEmail(email: string) {
    const users = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    return users;
  }

  async create(data: Prisma.usersCreateInput) {
    const users = await prisma.users.create({
      data,
    });

    return users;
  }
}

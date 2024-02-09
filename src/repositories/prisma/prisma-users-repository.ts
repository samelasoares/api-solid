import { prisma } from "@/lib/prisma";
import { Prisma, users } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository{
  findById(id: string): Promise< users | null> {
    throw new Error('Method not implemented')
  }

  async findByEmail(email: string){
    const users = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    return users
  }

  async create(data: Prisma.usersCreateInput) {
    const users = await prisma.users.create({
      data,
    });

    return users;
  }
}

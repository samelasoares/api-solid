import { Prisma, users } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: users[] = [];

  async findById(id_user: string) {
    const user = this.items.find((item) => item.id_user == id_user);

    if (!user) {
      return null;
    }

    return user;
  }


  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email == email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.usersCreateInput) {
    const user = {
      id_user: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.items.push(user);
    return user;
  }
}

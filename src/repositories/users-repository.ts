import { Prisma, users } from "@prisma/client";

export interface UsersRepository {
  findById(id: string): Promise<users | null>
  findByEmail(email:string): Promise< users | null>
  create(data: Prisma.usersCreateInput): Promise<users> 
}
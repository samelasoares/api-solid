// src/tests/helpers/reset-db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

if (!process.env.DATABASE_URL) {
  throw new Error("Please, provide a DATABASE_URL enviroment");
}

export default async () => {
  await prisma.$transaction([
    prisma.check_ins.deleteMany(),
    prisma.gyms.deleteMany(),
    prisma.users.deleteMany(),
  ]);

  await prisma.$disconnect()
}
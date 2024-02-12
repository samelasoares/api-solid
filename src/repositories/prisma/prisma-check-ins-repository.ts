import { Prisma, check_ins } from "@prisma/client";
import { CheckInRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInRepository {
  async findById(id_check_in: string) {
    const check_ins = await prisma.check_ins.findUnique({
      where: {
        id_check_in,
      },
    });
    return check_ins;
  }
  async findByUserIdOnDate(id_user: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const check_ins = await prisma.check_ins.findFirst({
      where: {
        id_user: id_user,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });
    return check_ins;
  }
  async findManyUserId(id_user: string, page: number) {
    const check_ins = await prisma.check_ins.findMany({
      where: {
        id_user: id_user,
      },
      take: 20,
      skip: (page - 1) * 20,
    });
    return check_ins;
  }
  async countByUserId(id_user: string) {
    const count = await prisma.check_ins.count({
      where: {
        id_user: id_user,
      },
    });
    return count;
  }
  async create(data: Prisma.check_insUncheckedCreateInput) {
    const check_ins = await prisma.check_ins.create({
      data,
    });
    return check_ins;
  }
  async save(data: check_ins) {
    const check_ins = await prisma.check_ins.update({
      where: {
        id_check_in: data.id_check_in,
      },
      data,
    });
    return check_ins;
  }
}

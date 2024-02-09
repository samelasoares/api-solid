import { Prisma, check_ins } from "@prisma/client";
import { CheckInRepository } from "../check-ins-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInRepository {
  public items: check_ins[] = [];

  async findById(id_check_in: string) {
    const checkIn = this.items.find((item) => item.id_check_in == id_check_in);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findByUserIdOnDate(id_user: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.items.find((check_ins) => {
      const checkInDate = dayjs(check_ins.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return check_ins.id_user == id_user && isOnSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async findManyUserId(id_user: string, page: number) {
    return this.items
      .filter((item) => item.id_user == id_user)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(id_user: string) {
    return this.items.filter((item) => item.id_user == id_user).length;
  }

  async create(data: Prisma.check_insUncheckedCreateInput) {
    const checkIn = {
      id_check_in: randomUUID(),
      id_user: data.id_user,
      id_gym: data.id_gym,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);
    return checkIn;
  }

  async save(check_ins: check_ins) {
    const checkInIndex = this.items.findIndex(
      (item) => item.id_check_in == check_ins.id_check_in
    );

    if (checkInIndex > 0) {
      this.items[checkInIndex] = check_ins;
    }

    return check_ins;
  }
}

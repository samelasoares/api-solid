import { Prisma, check_ins } from "@prisma/client";

export interface CheckInRepository {
  findById(id_check_ins: string): Promise<check_ins | null>
  findByUserIdOnDate(id_user: string, date: Date): Promise<check_ins | null>;
  findManyUserId(id_user: string, page: number): Promise<check_ins[]>;
  countByUserId(id_user: string): Promise<number>;
  create(data: Prisma.check_insUncheckedCreateInput): Promise<check_ins>;
  save(check_ins: check_ins): Promise<check_ins>;

}

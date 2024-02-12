import { Prisma, gyms } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";

export class PrismaGymRepository implements GymsRepository {
  async findById(id_gym: string) {
    const gyms = await prisma.gyms.findUnique({
      where: {
        id_gym,
      },
    });
    return gyms;
  }
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<gyms[]>`
     SELECT * FROM gyms
     WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude) ) * cos( radians(longitude) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude) ) ) ) < 10
    `;
    return gyms;
  }
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gyms.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });
    return gyms;
  }
  async create(data: Prisma.gymsCreateInput) {
    const gyms = await prisma.gyms.create({
      data,
    });
    return gyms;
  }
}

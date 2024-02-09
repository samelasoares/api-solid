import { Prisma, gyms } from "@prisma/client";

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<gyms | null>;
  findManyNearby(params: FindManyNearbyParams): Promise<gyms[]>
  searchMany(query: string, page: number): Promise<gyms[]>
  create(data: Prisma.gymsCreateInput): Promise<gyms>;
}

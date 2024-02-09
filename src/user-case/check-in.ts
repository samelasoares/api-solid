import { check_ins } from "@prisma/client";
import { CheckInRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

interface CheckInUsecaseRequest {
  id_user: string;
  id_gym: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUsecaseResponse {
  check_ins: check_ins;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    id_user,
    id_gym,
    userLatitude,
    userLongitude,
  }: CheckInUsecaseRequest): Promise<CheckInUsecaseResponse> {
    const gym = await this.gymsRepository.findById(id_gym);

    if (!gym) {
      throw new ResourceNotFoundError();
    }
    //calculate distance between user and gym
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { 
        latitude: gym.latitude.toNumber(), 
        longitude: gym.longitude.toNumber() 
      }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1 

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
      id_user,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    const check_ins = await this.checkInRepository.create({
      id_gym: id_gym,
      id_user: id_user,
    });

    return {
      check_ins,
    };
  }
}

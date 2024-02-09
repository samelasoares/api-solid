import { check_ins } from "@prisma/client";
import { CheckInRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInsHistoryUseCaseRequest {
  id_user: string;
  page: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  check_ins: check_ins[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    id_user,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const check_ins = await this.checkInRepository.findManyUserId(
      id_user,
      page,
    );

    return {
      check_ins,
    };
  }
}

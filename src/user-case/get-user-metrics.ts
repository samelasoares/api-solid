import { CheckInRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
  id_user: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    id_user,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(id_user);

    return {
      checkInsCount,
    };
  }
}

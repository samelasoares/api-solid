import { check_ins } from "@prisma/client";
import { CheckInRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateCheckInUsecaseRequest {
  id_check_ins: string;
}

interface ValidateCheckInUsecaseResponse {
  check_ins: check_ins;
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    id_check_ins,
  }: ValidateCheckInUsecaseRequest): Promise<ValidateCheckInUsecaseResponse> {
    const check_ins = await this.checkInRepository.findById(id_check_ins);

    if (!check_ins) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      check_ins.created_at,
      "minutes"
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    check_ins.validated_at = new Date();

    await this.checkInRepository.save(check_ins);

    return {
      check_ins,
    };
  }
}

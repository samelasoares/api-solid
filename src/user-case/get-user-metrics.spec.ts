import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let CheckInRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(CheckInRepository);
  });

  it("should be able to get check-ins count from metrics", async () => {
    await CheckInRepository.create({
      id_gym: "gym-01",
      id_user: "user-01",
    });

    await CheckInRepository.create({
      id_gym: "gym-02",
      id_user: "user-01",
    });

    const { checkInsCount } = await sut.execute({
      id_user: "user-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});

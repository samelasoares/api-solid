import { beforeEach, describe, expect, it, afterEach, vi } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let CheckInRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check-in Use Case", () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(CheckInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check in", async () => {
    const createdCheckIn = await CheckInRepository.create({
      id_gym: "gym-01",
      id_user: "user-01",
    });

    const { check_ins } = await sut.execute({
      id_check_ins: createdCheckIn.id_check_in,
    });

    expect(check_ins.validated_at).toEqual(expect.any(Date));
    expect(CheckInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate in inexistent check in", async () => {
    await expect(() =>
      sut.execute({
        id_check_ins: "inexistent-id_check_in",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await CheckInRepository.create({
      id_gym: "gym-01",
      id_user: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        id_check_ins: createdCheckIn.id_check_in,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});

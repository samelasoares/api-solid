import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let CheckInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async() => {
    CheckInRepository = new InMemoryCheckInRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(CheckInRepository, gymsRepository);

    await gymsRepository.create({
      id_gym: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -1.3667754,
      longitude: -48.3426188,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { check_ins } = await sut.execute({
      id_gym: "gym-01",
      id_user: "user-01",
      userLatitude: -1.3667754,
      userLongitude: -48.3426188,
    });

    expect(check_ins.id_user).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      id_gym: "gym-01",
      id_user: "user-01",
      userLatitude: -1.3667754,
      userLongitude: -48.3426188,
    });

    await expect(() =>
      sut.execute({
        id_gym: "gym-01",
        id_user: "user-01",
        userLatitude: -1.3667754,
        userLongitude: -48.3426188,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      id_gym: "gym-01",
      id_user: "user-01",
      userLatitude: -1.3667754,
      userLongitude: -48.3426188,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { check_ins } = await sut.execute({
      id_gym: "gym-01",
      id_user: "user-01",
      userLatitude: -1.3667754,
      userLongitude: -48.3426188,
    });

    expect(check_ins.id_check_in).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id_gym: "gym-02",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-1.338221),
      longitude: new Decimal(-48.2811987),
    });

    await expect(() =>
      sut.execute({
        id_gym: "gym-02",
        id_user: "user-01",
        userLatitude: -1.3667754,
        userLongitude: -48.3426188,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});

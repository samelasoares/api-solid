import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let CheckInRepository: InMemoryCheckInRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch User Check-in History Use Case", () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInRepository();
    sut = new FetchUserCheckInsHistoryUseCase(CheckInRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await CheckInRepository.create({
      id_gym: "gym-01",
      id_user: "user-01",
    });

    await CheckInRepository.create({
      id_gym: "gym-02",
      id_user: "user-01",
    });

    const { check_ins } = await sut.execute({
      id_user: "user-01",
      page: 1,
    });

    expect(check_ins).toHaveLength(2);
    expect(check_ins).toEqual([
      expect.objectContaining({ id_gym: "gym-01" }),
      expect.objectContaining({ id_gym: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await CheckInRepository.create({
        id_gym: `gym-${i}`,
        id_user: "user-01",
      });
    }

    const { check_ins } = await sut.execute({
      id_user: "user-01",
      page: 2,
    });

    console.log(check_ins)
    expect(check_ins).toHaveLength(2);
    expect(check_ins).toEqual([
      expect.objectContaining({ id_gym: "gym-21" }),
      expect.objectContaining({ id_gym: "gym-22" }),
    ]);
  });
});

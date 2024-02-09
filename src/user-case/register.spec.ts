import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./resgister";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { users } = await sut.execute({
      name: "Jhon Doe",
      email: "jhondoe@example.com",
      password: "123456",
    });

    expect(users.id_user).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { users } = await sut.execute({
      name: "Jhon Doe",
      email: "jhondoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      users.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "jhondoe@example.com";

    await sut.execute({
      name: "Jhon Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "Jhon Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./invalid-credentials-error";
import { compare } from "bcryptjs";
import { users } from "@prisma/client";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  users: users;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const users = await this.usersRepository.findByEmail(email);

    if (!users) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, users.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      users,
    };
  }
}

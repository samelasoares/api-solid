import { UsersRepository } from "@/repositories/users-repository";
import { users } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
 userId: string 
}

interface GetUserProfileUseCaseResponse {
  users: users;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const users = await this.usersRepository.findById(userId);

    if (!users) {
      throw new ResourceNotFoundError();
    }

    return {
      users,
    };
  }
}

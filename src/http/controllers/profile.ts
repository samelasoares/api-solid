import { makeGetUserProfileUseCase } from "@/user-case/factories/make-get=user-profile-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase();

  const { users } = await getUserProfile.execute({
    userId: request.user.sub,
  });
  return reply.status(200).send({
    users:{
      ...users,
      password_hash: undefined, 
    }
  });
}

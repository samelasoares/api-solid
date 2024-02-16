import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserMetricsUseCase } from "@/user-case/factories/make-get-user-metrics-use-case";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    id_user: request.user.sub,
  });

  return reply.status(200).send({
    checkInsCount,
  });
}

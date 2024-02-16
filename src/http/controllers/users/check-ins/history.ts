import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchUserCheckInsHistoryUseCase } from "@/user-case/factories/make-fetch-user-check-ins-history-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { check_ins } = await fetchUserCheckInsHistoryUseCase.execute({
    id_user: request.user.sub,
    page,
  });

  return reply.status(200).send({
    check_ins,
  });
}

import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeValidateCheckInUseCase } from "@/user-case/factories/make-validate-check-in-use-case";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    id_check_ins: z.string().uuid(),
  });

  const { id_check_ins } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.execute({
    id_check_ins,
  });

  return reply.status(204).send();
}

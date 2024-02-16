import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "@/user-case/factories/make-check-in-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    id_gym: z.string().uuid(),
   })
  
    const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 100;
    }),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
  const { id_gym } = createCheckInParamsSchema.parse(request.params);


  const checkInUseCase = makeCheckInUseCase();

  await checkInUseCase.execute({
    id_gym,
    id_user: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}

import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middleware/verify-jwt";
import { create } from "./create";
import { validate } from "./validate";
import { history } from "./history";
import { metrics } from "./metrics";
import { VerifyUserRole } from "@/http/middleware/verify-user-role";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);
  
  app.post("/gyms/:id_gym/check-ins", create);

  app.patch(
    "/check-ins/:id_check_ins/validate",
    { onRequest: [VerifyUserRole("ADMMIN")] },
    validate
  );
}

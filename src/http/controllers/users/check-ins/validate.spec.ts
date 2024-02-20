import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import resetDb from "@/utils/test/resetDb";
import { prisma } from "@/lib/prisma";

describe("Validate Check-in (e2e)", () => {
  beforeEach(async () => {
    await resetDb();
  });
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to validate a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const users = await prisma.users.findFirstOrThrow();

    const gyms = await prisma.gyms.create({
      data: {
        title: "JavaScript Gym",
        latitude: -1.3667754,
        longitude: -48.3426188,
      },
    });

    let checkIn = await prisma.check_ins.create({
      data: {
        id_gym: gyms.id_gym,
        id_user: users.id_user,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id_check_in}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    checkIn = await prisma.check_ins.findUniqueOrThrow({
      where: {
        id_check_in: checkIn.id_check_in,
      },
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});

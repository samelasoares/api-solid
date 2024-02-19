import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import resetDb from "@/utils/test/resetDb";
import { prisma } from "@/lib/prisma";

describe("Check-in History (e2e)", () => {
  beforeEach(async () => {
    await resetDb();
  });
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list the histroy of check-ins", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const users = await prisma.users.findFirstOrThrow();

    const gyms = await prisma.gyms.create({
      data: {
        title: "JavaScript Gym",
        latitude: -1.3667754,
        longitude: -48.3426188,
      },
    });

    await prisma.check_ins.createMany({
      data: [
        {
          id_gym: gyms.id_gym,
          id_user: users.id_user,
        },

        {
          id_gym: gyms.id_gym,
          id_user: users.id_user,
        },
      ],
    });

    const response = await request(app.server)
      .get("/check-ins/history")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.check_ins).toEqual([
      expect.objectContaining({
        id_gym: gyms.id_gym,
        id_user: users.id_user,
      }),
      expect.objectContaining({
        id_gym: gyms.id_gym,
        id_user: users.id_user,
      }),
    ]);
  });
});

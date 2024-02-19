import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import resetDb from "@/utils/test/resetDb";
import { prisma } from "@/lib/prisma";

describe("Create Check-in (e2e)", () => {
  beforeEach(async () => {
    await resetDb();
  });
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gyms.create({
      data: {
        title: "JavaScript Gym",
        latitude: -1.3667754,
        longitude: -48.3426188,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id_gym}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -1.3667754,
        longitude: -48.3426188,
      });
    expect(response.statusCode).toEqual(201);
  });
});

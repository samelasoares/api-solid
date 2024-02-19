import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import resetDb from "@/utils/test/resetDb";

describe("Create Gym (e2e)", () => {
  beforeEach(async () => {
    await resetDb();
  });
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description.",
        phone: "11999999999",
        latitude: -1.3667754,
        longitude: -48.3426188,
      });
    expect(response.statusCode).toEqual(201);
  });
});

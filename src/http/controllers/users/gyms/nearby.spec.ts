import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import resetDb from "@/utils/test/resetDb";

describe("Nearby Gyms (e2e)", () => {
  beforeEach(async () => {
    await resetDb();
  });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await resetDb();
    await app.close();
  });

  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description.",
        phone: "1199999999",
        latitude: -1.3667754,
        longitude: -48.3426188,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript Gym",
        description: "Some description.",
        phone: "1199999999",
        latitude: -1.3665208,
        longitude: -47.357282,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -1.3667754,
        longitude: -48.3426188,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript Gym",
      }),
    ]);
  });
});

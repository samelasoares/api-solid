import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import resetDb from "@/utils/test/resetDb";

describe("Profile (e2e)", () => {
  beforeEach(async () => {
    await resetDb();
  });
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.users).toEqual(
      expect.objectContaining({
        email: "johndoe@example.com",
      })
    );
  });
});

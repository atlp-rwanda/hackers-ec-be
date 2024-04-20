import app from "../app";
import request from "supertest";
import { connectionToDatabase } from "../database/config/db.config";

jest.setTimeout(30000);

describe("LOGIN API TEST", () => {
  beforeAll(async () => {
    await connectionToDatabase();
  });

  it("should login successfully with correct credentials", async () => {
    // Your test implementation goes here
    const { body } = await request(app).get("")
    console.log(body);
  });
  it("should return 401 for login with incorrect credentials", async () => {
    // Your test implementation goes here
  });
  it("should return authenticated data after login with valid token", async () => {
    // Your test implementation goes here
  });
});

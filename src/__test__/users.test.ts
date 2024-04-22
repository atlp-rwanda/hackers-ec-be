import app from "../app";
import request from "supertest";
import { connectionToDatabase } from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import { User } from "../database/models/User";
import {
  login_user,
  login_user_invalid_email,
  login_user_wrong_credentials,
  register_user,
} from "../mock/static";

jest.setTimeout(30000);

function logErrors(
  err: { stack: any },
  _req: any,
  _res: any,
  next: (arg0: any) => void
) {
  console.log(err.stack);
  next(err);
}

const Jest_request = request(app.use(logErrors));

describe("USER API TEST", () => {
  beforeAll(async () => {
    await connectionToDatabase();
  });

  afterAll(async () => {
    await deleteTableData(User, "users");
  });

  it("should create a new user", async () => {
    // Your test implementation goes here
    const { body } = await Jest_request.post("/api/v1/users/register")
      .send(register_user)
      .expect(201);
  });

  /**
   * ---------------------------- LOGIN --------------------------------------------
   */

  it("should successfully login a user and return 200", async () => {
    const { body } = await Jest_request.post("/api/v1/users/login")
      .send(login_user)
      .expect(200);
    expect(body.status).toStrictEqual("SUCCESS");
    expect(body.message).toStrictEqual(
      "Logged in to your account successfully!"
    );
    expect(body.token).toBeDefined();
  });

  it("should return 404 when a user login with wrong credentials", async () => {
    const { body } = await Jest_request.post("/api/v1/users/login")
      .send(login_user_wrong_credentials)
      .expect(404);
    expect(body.status).toStrictEqual("NOT FOUND");
    expect(body.message).toStrictEqual("Wrong credentials!");
  });

  it("should return 400 when a user user enter invalid email (login validation purposes)", async () => {
    const { body } = await Jest_request.post("/api/v1/users/login")
      .send(login_user_invalid_email)
      .expect(400);
    expect(body.status).toStrictEqual("BAD REQUEST");
    expect(body.message).toStrictEqual("Invalid email!");
  });

  it("should return 400 when request body is invalid", async () => {
    const { body } = await Jest_request.post("/api/v1/users/login")
      .send({})
      .expect(400);
    expect(body.status).toStrictEqual("BAD REQUEST");
    expect(body.message).toBeDefined();
  })
});

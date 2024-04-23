import app from "../app";
import request from "supertest";
import { connectionToDatabase } from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import { User } from "../database/models/User";
import {
	login_user,
	login_user_invalid_email,
	login_user_wrong_credentials,
	NewUser,
	user_bad_request,
} from "../mock/static";

jest.setTimeout(30000);

function logErrors(
	err: { stack: any },
	_req: any,
	_res: any,
	next: (arg0: any) => void,
) {
	console.log(err.stack);
	next(err);
}

const Jest_request = request(app.use(logErrors));
let token: string;

describe("USER API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});

	afterAll(async () => {
		await deleteTableData(User, "users");
	});
	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(NewUser)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Plase Verify your Account",
		);
		token = body.token;
	});
	it("it should return a user not found and status 400", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(user_bad_request)
			.expect(400);
	});

	it("it should return a user exist and status 409 when Email is already used in database", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(NewUser)
			.expect(409);
		expect(body.status).toStrictEqual("CONFLICT");
		expect(body.message).toStrictEqual("User already exist!");
	});
	it("should verify a user's account and return 200", async () => {
		// Assuming you have a way to create a user and a corresponding verification token

		const { body } = await Jest_request.get(
			`/api/v1/users/account/verify/${token}`,
		).expect(200);

		expect(body.status).toStrictEqual(200);
		expect(body.message).toStrictEqual("Email verified successfull");
	});

	it("should return 400 when the token is invalid", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/users/account/verify/${token}`,
		).expect(400);

		expect(body.status).toStrictEqual(400);
		expect(body.message).toStrictEqual("Invalid link");
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
			"Logged in to your account successfully!",
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
	});
});

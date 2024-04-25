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

let token: string;

const Jest_request = request(app.use(logErrors));

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
		expect(body.message).toStrictEqual("Account Created successfully!");
		expect(body.token).toBeDefined();
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

		token = body.token;
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

	/**
	 * -----------------------------------------LOG OUT--------------------------------------
	 */
	it("Should log out a user and return 404", async () => {
		const { body } = await Jest_request.post("/api/v1/users/logout").send();
		expect(404);
		expect(body.status).toStrictEqual("NOT FOUND");
		expect(body.message).toStrictEqual("Token Not Found");
	});

	it("Should log out a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/logout")
			.send()
			.set("Authorization", `Bearer ${token}`);
		expect(201);
		expect(body.status).toStrictEqual("CREATED");
		expect(body.message).toStrictEqual("Logged out successfully");
		token = token;
	});

	it("Should alert an error and return 401", async () => {
		const { body } = await Jest_request.post("/api/v1/users/logout")
			.send()
			.set("Authorization", `Bearer ${token}`);
		expect(401);
		expect(body.status).toStrictEqual("UNAUTHORIZED");
		expect(body.message).toStrictEqual("Already logged out");
	});
});

import app from "../app";
import request from "supertest";
import { connectionToDatabase } from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import { User } from "../database/models/User";
import { google_profile } from "../mock/static";
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

describe("GOOGLE API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});

	afterAll(async () => {
		await deleteTableData(User, "users");
	});

	it("should simulate Google oAuth flow and return 302", async () => {
		const response = await Jest_request.get("/api/v1/users/auth/google").expect(
			302,
		);
		expect(response.header.location).toStrictEqual(
			"/api/v1/users/auth/google/callback",
		);
		expect(response.redirect).toBeTruthy();
		expect(response.header["set-cookie"]).toBeDefined();
	});

	it("should handle google oauth callback and display user data to log in or to create user", async () => {
		const response = await Jest_request.get(
			"/api/v1/users/auth/google/callback",
		).query(google_profile);
		expect(response.status).toBe(302);

		const google_url = response.header.location;

		expect(google_url).toBeDefined();
	});

	it("Welcome to Hacker's e-commerce backend and return 200", async () => {
		const { body } = await Jest_request.get("/").expect(200);
	});

	it("should display login home page and return 200", async () => {
		const { body } = await Jest_request.get("/api/v1/").expect(200);
		expect(body.message).toBe("Welcome to Hacker's e-commerce backend!");
	});
});

import app from "../app";
import request from "supertest";
import { connectionToDatabase } from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import { User } from "../database/models/User";
import { updatePassword } from "../controllers/userController";
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

	it("should update user password and return 200", async () => {
		try {
			const loginResponse = await Jest_request.post("/api/v1/users/login")
				.send(login_user)
				.expect(200);

			const authToken = loginResponse.body?.token;

			if (!authToken) {
				throw new Error("Token not found in login response");
			}

			const { body } = await Jest_request.patch("/api/v1/users/password-update")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					oldPassword: "passwordQWE123",
					newPassword: "newPassword123", // Change the new password here
					confirmPassword: "newPassword123",
				})
				.expect(200);

			expect(body.status).toStrictEqual("SUCCESS");
			expect(body.message).toStrictEqual("Password updated successfully");
		} catch (error) {
			console.error("Error updating password:", error);
			throw error;
		}
	});
});

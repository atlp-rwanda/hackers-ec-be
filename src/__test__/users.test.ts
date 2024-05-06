import app from "../app";
import request from "supertest";
import { deleteTableData } from "../utils/database.utils";
import { User } from "../database/models/User";
import { forgotPassword } from "../controllers/resetPasswort";
import { resetPasswort } from "../controllers/resetPasswort";

import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import {
	bad_two_factor_authentication_data,
	login_user,
	login_user_br,
	login_user_invalid_email,
	login_user_wrong_credentials,
	NewUser,
	partial_two_factor_authentication_data,
	two_factor_authentication_data,
	user_bad_request,
	newPasswordBody,
	NotUserrequestBody,
	sameAsOldPassword,
	update_pass,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { resetPassword } from "../database/models/resetPassword";

jest.setTimeout(30000);

const role = database_models["role"];
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

let resetToken = "";
let id: string;

describe("USER API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
		const adminRole = await role.findOne({ where: { roleName: "ADMIN" } });
		if (adminRole) {
			id = adminRole?.dataValues.id;
		}
	});

	afterAll(async () => {
		await deleteTableData(database_models.Token, "tokens");
		await deleteTableData(database_models.User, "users");
	});
	it("Welcome to Hacker's e-commerce backend and return 200", async () => {
		const { body } = await Jest_request.get("/").expect(200);
	});

	it("should display login home page and return 200", async () => {
		const { body } = await Jest_request.get("/api/v1/").expect(200);
		expect(body.message).toBe("Welcome to Hacker's e-commerce backend!");
	});

	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(NewUser)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
		);
		const tokenRecord = await database_models.Token.findOne();
		token = tokenRecord?.dataValues.token ?? "";
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
	});

	it("should verify a user's account and return 200", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/users/account/verify/${token}`,
		);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Email verified successfully!");
	});

	it("should return 400 when the token is invalid", async () => {
		const { body } = await Jest_request.get(
			`/api/v1/users/account/verify/${token}`,
		).expect(400);

		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("Invalid link");
	});

	it("should successfully login a user and return 200", async () => {
		await database_models.User.update(
			{ isVerified: true },
			{
				where: { email: login_user.email },
			},
		);

		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(login_user)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Login successfully!");
	});

	it("Should successfully login a seller and return 202", async () => {
		await User.update(
			{ role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
			{
				where: { email: login_user.email },
			},
		);

		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(login_user)
			.expect(202);

		expect(body.status).toStrictEqual("ACCEPTED");
		expect(body.message).toStrictEqual(
			"Email sent for verification. Please check your inbox and enter the OTP to complete the authentication process.",
		);
	});

	it("should return 401 when a user login with wrong credentials", async () => {
		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(login_user_wrong_credentials)
			.expect(401);
		expect(body.status).toStrictEqual("UNAUTHORIZED");
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

	it("should return 400 when password is not provided", async () => {
		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(login_user_br)
			.expect(400);
		expect(body.status).toStrictEqual("BAD REQUEST");
		expect(body.message).toStrictEqual("password is required");
	});

	/***
	 * ----------------------------- Password Update -------------------------------------------
	 */

	it("should update user password and return 200", async () => {
		console.log("tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", update_pass);
		const { body } = await Jest_request.patch("/api/v1/users/password-update")
			.set("Authorization", `Bearer ${token}`)
			.send(update_pass)
			.expect(200);

		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Password updated successfully");
	});

	/***
	 * ---------------------------- RESET PASSWORD --------------------------------------------
	 */

	it("it should return 200 when email is sent to user resetting password", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			email: NewUser.email,
		});
		await resetPassword.create({
			resetToken: authenticatetoken,
			email: NewUser.email,
		});
		const { body } = await Jest_request.post("/api/v1/users/forgot-password")
			.send({ email: NewUser.email })
			.expect(200);
		resetToken = authenticatetoken;
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Email sent successfully");
	});

	it("it should return 404 when user requesting reset is not found in database", async () => {
		const { body } = await Jest_request.post("/api/v1/users/forgot-password")
			.send(NotUserrequestBody)
			.expect(404);

		expect(body.message).toEqual("User not found");
	});

	it("it should return 400 when email is not provided", async () => {
		const { body } = await Jest_request.post("/api/v1/users/forgot-password")
			.send({})
			.expect(400);
	});

	it("it should return 200 when password reset successfully", async () => {
		expect(resetToken).toBeDefined();
		expect(resetToken).not.toEqual("");
		const tokenRecord = await resetPassword.findOne();
		const tokenn = tokenRecord?.dataValues.resetToken;

		const { body } = await Jest_request.post(
			`/api/v1/users/reset-password/${tokenn}`,
		)
			.send(newPasswordBody)
			.expect(200);
	});

	it("should return 400 if no decoded token is found", async () => {
		const response = await request(app)
			.post(
				"/api/v1/users/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmYmM3NzM4LWE5YWItNDc2MC1hYzIxLWUzNTZkNGY0NDZjNyIsImVtYWlsIjoiaXphbnlpYnVrYXl2ZXR0ZTEwNUBnbWFpbC5jb20iLCJpYXQiOjE3MTQwNzcxOTksImV4cCI6MTcxNDE2MzU5OX0.wwtJXaviKcQYqmVX0LI0Yw1jG0wmBSqW4rHZA0Vh8zk",
			)
			.send({
				password: "newPassword123",
			});

		expect(404);
		expect(response.body.message).toBe("Invalid link");
	});

	it("it should return 400 when new password is the same to old password", async () => {
		expect(resetToken).toBeDefined();
		expect(resetToken).not.toEqual("");
		const { body } = await Jest_request.post(
			`/api/v1/users/reset-password/${resetToken}`,
		)
			.send(sameAsOldPassword)
			.expect(400);
	});

	it("it should return 400 when invalid link is provided", async () => {
		const { body } = await Jest_request.post(
			`/api/v1/users/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmYmM3NzM4LWE5YWItNDc2MC1hYzIxLWUzNTZkNGY0NDZjNyIsImVtYWlsIjoiaXphbnlpYnVrYXl2ZXR0ZTEwNUBnbWFpbC5jb20iLCJpYXQiOjE3MTQwNzcxOTksImV4cCI6MTcxNDE2MzU5OX0.wwtJXaviKcQYqmVX0LI0Yw1jG0wmBSqW4rHZA0Vh8zk`,
		)
			.send(newPasswordBody)
			.expect(400);
	});

	it("should return 400 when no token is provided", async () => {
		const { body } = await Jest_request.post("/api/v1/users/reset-password/")
			.send(newPasswordBody)
			.expect(404);
	});

	jest.mock("../helpers/nodemailer", () => ({
		sendEmail: jest.fn(),
	}));

	it("should send an email with the correct mailOptions", async () => {
		const req: any = {
			body: { email: "test@example.com" },
		} as any;

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		await forgotPassword(req, res);
	});

	it("should return 500 if token is missing or invalid", async () => {
		const req: any = {};

		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await resetPasswort(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	/*
	 * ---------------------------- TWO FACTOR AUTHENTICATION --------------------------------------------
	 */

	it("should authenticate the user and return SUCCESS", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});
		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send(two_factor_authentication_data)
			.expect(200);

		expect(body.message).toStrictEqual("Account authentication successfully!");
	});

	it("should return 401 if user add invalid otp", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});
		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send(bad_two_factor_authentication_data)
			.expect(401);
		expect(body.message).toStrictEqual("Invalid One Time Password!!");
	});

	it("should return 400 if user add with character < 6 invalid otp", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});
		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send(partial_two_factor_authentication_data)
			.expect(400);
		expect(body.message).toStrictEqual(
			"OTP must be exactly 6 characters long!",
		);
	});

	it("should return 400 if otp is not provided", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});
		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send({})
			.expect(400);
		expect(body.message).toStrictEqual("otp is required");
	});

	/**
	 * -----------------------------------------LOG OUT--------------------------------------
	 */

	it("Should log out a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/logout")
			.send()
			.set("Authorization", `Bearer ${token}`);
		expect(201);
		expect(body.status).toStrictEqual("CREATED");
		expect(body.message).toStrictEqual("Logged out successfully");
	});

	it("Should alert an error and return 401", async () => {
		const { body } = await Jest_request.post("/api/v1/users/logout").send();
		expect(401);
		expect(body.status).toStrictEqual("UNAUTHORIZED");
	});
});

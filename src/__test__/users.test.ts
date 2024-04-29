import app from "../app";
import request from "supertest";
import { connectionToDatabase } from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import { User } from "../database/models/User";
import { Token } from "../database/models/token";
import { forgotPassword } from "../controllers/resetPasswort";
import { resetPasswort } from "../controllers/resetPasswort";
import { Request } from "express";

import {
	bad_two_factor_authentication_data,
	login_user,
	login_user_invalid_email,
	login_user_wrong_credentials,
	NewUser,
	partial_two_factor_authentication_data,
	two_factor_authentication_data,
	user_bad_request,
	requestResetBody,
	newPasswordBody,
	NotUserrequestBody,
	sameAsOldPassword,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { resetPassword } from "../database/models/resetPassword";

jest.setTimeout(30000);

let authenticatetoken: string;
let otp: string;

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

describe("USER API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});

	afterAll(async () => {
		await deleteTableData(User, "users");
		await deleteTableData(Token, "tokens");
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
			"Account Created successfully, Plase Verify your Account",
		);

		const tokenRecord = await Token.findOne();
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

		expect(body.status).toStrictEqual("CONFLICT");
		expect(body.message).toStrictEqual("User already exist!");
	});

	it("should verify a user's account and return 200", async () => {
		// Assuming you have a way to create a user and a corresponding verification token

		const { body } = await Jest_request.get(
			`/api/v1/users/account/verify/${token}`,
		);
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
		await User.update(
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
		expect(body.response.message).toStrictEqual("Invalid One Time Password!!");
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

	it("should return 400 if user add with character < 6 invalid otp", async () => {
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

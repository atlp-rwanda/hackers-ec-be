import { NextFunction, Request, Response } from "express";
import {
	TokenData,
	generateAccessToken,
	verifyAccessToken,
} from "../helpers/security.helpers";
import { sendResponse } from "../utils/http.exception";
import randomatic from "randomatic";
import HTML_TEMPLATE from "../utils/mail-template";
import passport from "../middlewares/passport";
import { validateToken } from "../utils/token.validation";
import { ACCESS_TOKEN_SECRET } from "../utils/keys";
import { sendEmail } from "../helpers/nodemailer";
import {
	BlacklistModelAtributes,
	TokenModelAttributes,
	UserModelAttributes,
	UserModelInclude,
} from "../types/model";
import { InfoAttribute } from "../types/passport";
import { insert_function, read_function } from "../utils/db_methods";

import { User } from "../database/models/User";
import bcrypt from "bcrypt";
import { HttpException } from "../utils/http.exception";
import { PassThrough } from "stream";
import jwt, { JwtPayload } from "jsonwebtoken";



const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.body) {
			passport.authenticate(
				"signup",
				(err: Error, user: UserModelAttributes, info: InfoAttribute) => {
					if (info) {
						return sendResponse(res, 409, "CONFLICT", info.message);
					}
					req.login(user, async () => {
						const token = generateAccessToken({ id: user.id, role: user.role });
						await insert_function<TokenModelAttributes>("Token", "create", {
							token,
						});
						const message = `${process.env.BASE_URL}/users/account/verify/${token}`;
						await sendEmail({
							to: user.email,
							subject: "Verify Email",
							html: message,
						});
						return sendResponse(
							res,
							201,
							"SUCCESS",
							"Account Created successfully, Please Verify your Account",
						);
					});
				},
			)(req, res, next);
		}
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			(error as Error).message,
		);
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		"login",
		(error: Error, user: UserModelAttributes, info: InfoAttribute) => {
			if (error) {
				return sendResponse(res, 400, "BAD REQUEST", "Bad Request!");
			}

			if (info) {
				return sendResponse(res, 401, "UNAUTHORIZED", info.message);
			}

			(req as any).login(user, async (err: Error) => {
				if (err) {
					return sendResponse(res, 400, "BAD REQUEST", "Bad Request!");
				}

				const { id, email, firstName, lastName } = user;
				const role = (user as UserModelInclude).Roles?.roleName;

				let authenticationtoken: string;

				if (role === "SELLER") {
					const otp = randomatic("0", 6);

					authenticationtoken = generateAccessToken({ id, role, otp });

					const host =
						process.env.HOST || `http://localhost:${process.env.port}`;

					const authenticationlink = `${host}host/api/v1/users/2fa?token=${authenticationtoken}`;

					const message = `Hello ${firstName + " " + lastName},<br><br>

        You recently requested to log in to ShopTrove E-Commerce app. To complete the login process,Please enter the following verification code <br><br> OTP:${otp} <br><br> You can also use the following link along with the provided OTP to complete your login:<br><br> <a href ='${authenticationlink}'>${authenticationlink}</a> <br><br> If you didn't request this, you can safely ignore this email. Your account is secure.

        Thank you,<br><br>
        The ShopTrove E-Commerce app Team`;

					const options = {
						to: email,
						subject: "Your Login Verification Code",
						html: HTML_TEMPLATE(message),
					};
					await insert_function<TokenModelAttributes>("Token", "create", {
						token: authenticationtoken,
					});

					sendEmail(options);
					return sendResponse(
						res,
						202,
						"ACCEPTED",
						"Email sent for verification. Please check your inbox and enter the OTP to complete the authentication process.",
					);
				} else {
					authenticationtoken = generateAccessToken({ id, role });
					return sendResponse(
						res,
						200,
						"SUCCESS",
						"Login successfully!",
						authenticationtoken,
					);
				}
			});
		},
	)(req, res, next);
};

const accountVerify = async (req: Request, res: Response) => {
	try {
		const token = await read_function<TokenModelAttributes>(
			"Token",
			"findOne",
			{ where: { token: req.params.token } },
		);
		if (!token) {
			return sendResponse(res, 400, "BAD REQUEST", "Invalid link");
		}

		const { user } = validateToken(token.token, ACCESS_TOKEN_SECRET as string);
		if (!user) {
			return sendResponse(res, 400, "BAD REQUEST", "Invalid link");
		}
		await insert_function<UserModelAttributes>(
			"User",
			"update",
			{ isVerified: true },
			{ where: { id: user.id } },
		);
		await read_function<TokenModelAttributes>("Token", "destroy", {
			where: { id: token.id },
		});
		return sendResponse(res, 200, "SUCCESS", "Email verified successfully!");
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			(error as Error).message,
		);
	}
};

export const googleAuthInit = async (req: Request, res: Response) => {
	passport.authenticate("google", { scope: ["profile", "email"] });
	res.redirect("/api/v1/users/auth/google/callback");
};

export const handleGoogleAuth = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		passport.authenticate(
			"google",
			async (err: Error, user: UserModelAttributes) => {
				const userData = user;
				const userExist = await read_function<UserModelAttributes>(
					"User",
					"findOne",
					{ where: { email: userData.email } },
				);

				if (userExist) {
					const token = generateAccessToken({
						id: userExist.id,
						role: userExist.role,
					});
					return sendResponse(
						res,
						200,
						"SUCCESS",
						"Logged in to you account successfully!",
						token,
					);
				}

				const newUser = await insert_function<UserModelAttributes>(
					"User",
					"create",
					{ ...userData },
				);
				const token = generateAccessToken({
					id: newUser.id,
					role: newUser.role,
				});
				return sendResponse(
					res,
					201,
					"SUCCESS",
					"Account Created successfully!",
					token,
				);
			},
		)(req, res, next);
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			(error as Error).message,
		);
	}
};

const two_factor_authentication = async (req: Request, res: Response) => {
	try {
		const { otp } = req.body;
		const { token } = req.params;
		const decodedToken = verifyAccessToken(token, res) as TokenData;
		if (decodedToken && decodedToken.otp && otp === decodedToken.otp) {
			await read_function<TokenModelAttributes>("Token", "destroy", {
				where: { token: token },
			});
			return sendResponse(
				res,
				200,
				"SUCCESS",
				"Account authentication successfully!",
				token,
			);
		} else {
			return sendResponse(
				res,
				401,
				"Unauthorized",
				"Invalid One Time Password!!",
			);
		}
	} catch (error: any) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			(error as Error).message,
		);
	}
};

const logout = async (req: Request, res: Response) => {
	try {
		const token = req.headers["authorization"]?.split(" ")[1];
		if (token) {
			await insert_function<BlacklistModelAtributes>("Blacklist", "create", {
				token,
			});
			return sendResponse(res, 201, "CREATED", "Logged out successfully");
		}
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			(error as Error).message,
		);
	}
};

export const updatePassword = async (req: Request, res: Response) => {
	try {
		const { oldPassword, newPassword, confirmPassword } = req.body;

		if (!req.headers.authorization) {
			return res
				.status(401)
				.json(new HttpException("UNAUTHORIZED", "Token is missing"));
		}

		const token = req.headers.authorization.split(" ")[1];
		console.log("token**",token);

		const decoded = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;

		const user = await User.findOne({ where: { id: decoded.id } });

		const userPassword = user?.dataValues.password;

		const isPasswordValid = await bcrypt.compare(
			oldPassword,
			userPassword as string,
		);

		console.log("****************user", isPasswordValid);
		if (!isPasswordValid) {
			return res
				.status(400)
				.json(new HttpException("BAD REQUEST", "Old password is incorrect"));
		}

		if (newPassword !== confirmPassword) {
			return res
				.status(400)
				.json(
					new HttpException(
						"BAD REQUEST",
						"New password and confirm password do not match",
					),
				);
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await User.update(
			{ password: hashedPassword },
			{ where: { id: decoded.id } },
		);

		const response = new HttpException(
			"SUCCESS",
			"Password updated successfully",
		).response();
		res.status(200).json(response);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new HttpException("INTERNAL SERVER ERROR", "Something really went wrong"));
	}
};
export default {
	registerUser,
	login,
	accountVerify,
	two_factor_authentication,
	googleAuthInit,
	handleGoogleAuth,
	logout,
  updatePassword,
};

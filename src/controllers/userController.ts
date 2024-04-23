import { NextFunction, Request, Response } from "express";
import { User, UserModelAttributes } from "../database/models/User";
import {
	TokenData,
	generateAccessToken,
	verifyAccessToken,
} from "../helpers/security.helpers";
import { HttpException } from "../utils/http.exception";
import randomatic from "randomatic";
import HTML_TEMPLATE from "../utils/mail-template";
import { Token } from "../database/models/token";
import passport from "../middlewares/passport";
// import sendEmail from "../utils/email";
import { validateToken } from "../utils/token.validation";
import { ACCESS_TOKEN_SECRET } from "../utils/keys";
import { sendEmail } from "../helpers/nodemailer";

interface InfoAttribute {
	message: string;
}

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
					if (!user) {
						return res
							.status(409)
							.json(new HttpException("CONFLICT", info.message));
					}
					req.login(user, async () => {
						const token = generateAccessToken({ id: user.id, role: user.role });
						await Token.create({ token });

						const message = `${process.env.BASE_URL}/users/account/verify/${token}`;
						await sendEmail({
							to: user.email,
							subject: "Verify Email",
							html: message,
						});
						const response = new HttpException(
							"SUCCESS",
							"Account Created successfully, Plase Verify your Account",
						).response();

						res.status(201).json({ ...response });
					});
				},
			)(req, res, next);
		}
	} catch (error) {
		res
			.status(500)
			.json(new HttpException("SERVER FAILS", "Something went wrong!"));
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		"login",
		(error: Error, user: UserModelAttributes, info: InfoAttribute) => {
			if (error) {
				return res
					.status(400)
					.json(new HttpException("BAD REQUEST", "Bad Request!"));
			}

			if (info) {
				return res
					.status(401)
					.json(new HttpException("UNAUTHORIZED", info.message));
			}

			(req as any).login(user, (err: Error) => {
				if (err) {
					return res
						.status(400)
						.json(new HttpException("BAD REQUEST", "Bad Request!"));
				}

				const { id, role, email, firstName, lastName } = user;

				let authenticationtoken: string;

				authenticationtoken = generateAccessToken({ id, role });

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
					Token.create({ token: authenticationtoken });

					sendEmail(options);

					const response = new HttpException(
						"ACCEPTED",
						"Email sent for verification. Please check your inbox and enter the OTP to complete the authentication process.",
					).response();
					return res.status(202).json({ response });
				} else {
					const response = new HttpException(
						"SUCCESS",
						"Login successfully!",
					).response();
					return res
						.status(200)
						.json({ ...response, token: authenticationtoken });
				}
			});
		},
	)(req, res, next);
};

const accountVerify = async (req: Request, res: Response) => {
	try {
		const token = await Token.findOne({ where: { token: req.params.token } });

		if (!token) {
			return res.status(400).json({ status: 400, message: "Invalid link" });
		}

		const { user } = validateToken(
			token.dataValues.token,
			ACCESS_TOKEN_SECRET as string,
		);
		if (!user) {
			return res.status(400).json({ status: 400, message: "Invalid link" });
		}
		await User.update({ isVerified: true }, { where: { id: user.id } });
		await Token.destroy({ where: { id: token.dataValues.id } });
		res
			.status(200)
			.json({ status: 200, message: "Email verified successfull" });
	} catch (error) {
		res
			.status(400)
			.json({ status: 400, message: "Something went wrong", error: error });
	}
};
const googleAuthInit = async (req: Request, res: Response) => {
	passport.authenticate("google", { scope: ["profile", "email"] });
	res.redirect("/api/v1/users/auth/google/callback");
};

const handleGoogleAuth = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		passport.authenticate(
			"google",
			async (err: Error, user: UserModelAttributes) => {
				const userData = user;
				const userExist = await User.findOne({
					where: { email: userData.email },
				});

				if (userExist) {
					const token = generateAccessToken({
						id: userExist.dataValues.id,
						role: userExist.dataValues.role,
					});
					const response = new HttpException(
						"SUCCESS",
						"Logged in to you account successfully!",
					).response();
					return res.status(200).json({ ...response, token });
				}
				const newUser = await User.create({ ...userData });
				await newUser.save();
				const token = generateAccessToken({
					id: newUser.dataValues.id,
					role: newUser.dataValues.role,
				});
				const response = new HttpException(
					"SUCCESS",
					"Account Created successfully!",
				).response();
				res.status(201).json({ ...response, token });
			},
		)(req, res, next);
	} catch (error) {
		res
			.status(500)
			.json(new HttpException("SERVER ERROR", "Something went wrong!"));
	}
};

const two_factor_authentication = async (req: Request, res: Response) => {
	try {
		const { otp } = req.body;
		const { token } = req.params;
		const decodedToken = verifyAccessToken(token, res) as TokenData;
		if (decodedToken && decodedToken.otp && otp === decodedToken.otp) {
			Token.destroy({ where: { token: token } });
			if (process.env.DEV_MODE) {
				const response = new HttpException(
					"SUCCESS",
					"Account authentication successfully!",
				).response();
				return res.status(200).json({ ...response, token, otp });
			}
			const response = new HttpException(
				"SUCCESS",
				"Account authentication successfully!",
			).response();
			return res.status(200).json({ response });
		} else {
			const response = new HttpException(
				"Unauthorized",
				"Invalid One Time Password!!",
			).response();
			return res.status(401).json({ response });
		}
	} catch (error: any) {
		return res.status(500).json({
			status: 500,
			error: error.message,
		});
	}
};

export default {
	registerUser,
	login,
	accountVerify,
	two_factor_authentication,
	googleAuthInit,
	handleGoogleAuth,
};

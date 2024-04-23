import { NextFunction, Request, Response } from "express";
import { UserModelAttributes } from "../database/models/User";
import { generateAccessToken } from "../helpers/security.helpers";
import { HttpException } from "../utils/http.exception";
import passport, { CustomVerifyOptions } from "../middlewares/passport";
import { Token } from "../database/models/token";
import sendEmail from "../utils/email";
import { validateToken } from "../utils/token.validation";
import { JWT_SECRET } from "../utils/keys";
import { User } from "../database/models/User";

interface InfoAttribute extends CustomVerifyOptions {}

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
							.status(info.statusNumber || 400)
							.json(new HttpException(info.status, info.message));
					}
					req.login(user, async () => {
						const token = generateAccessToken({ id: user.id, role: user.role });
						await Token.create({ token });
						const message = `${process.env.BASE_URL}/users/account/verify/${token}`;
						await sendEmail({
							user: user.email,
							subject: "Verify Email",
							message: message,
						});
						const response = new HttpException(
							"SUCCESS",
							"Account Created successfully, Plase Verify your Account",
						).response();
						res.status(201).json({ ...response, token });
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
					.status(404)
					.json(new HttpException("NOT FOUND", info.message));
			}

			(req as any).login(user, (err: Error) => {
				if (err) {
					return res
						.status(400)
						.json(new HttpException("BAD REQUEST", "Bad Request!"));
				}

				const { id, role } = user;

				const token = generateAccessToken({ id, role });
				const response = new HttpException(
					"SUCCESS",
					"Logged in to your account successfully!",
				).response();
				return res.status(200).json({ ...response, token });
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

		const { user } = validateToken(token.dataValues.token, JWT_SECRET || "");
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

export default {
	registerUser,
	login,
	accountVerify,
};

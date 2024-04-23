import { NextFunction, Request, Response } from "express";
import { UserModelAttributes } from "../database/models/User";
import { generateAccessToken } from "../helpers/security.helpers";
import { HttpException } from "../utils/http.exception";
import passport, { CustomVerifyOptions } from "../middlewares/passport";
import { Token } from "../database/models/token";
import sendEmail from "../utils/email";
sendEmail;

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
							email: user.email,
							subject: "Verify Email",
							message: message,
						});
						const response = new HttpException(
							"SUCCESS",
							"Account Created successfully!",
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

			if (info)
				return res
					.status(404)
					.json(new HttpException("NOT FOUND", info.message));

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

export default {
	registerUser,
	login,
};

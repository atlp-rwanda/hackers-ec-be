import { userValidate } from "../validations/user.valid";
import { NextFunction, Request, Response } from "express";
import validateLogIn from "../validations/login.validation";
import { HttpException } from "../utils/http.exception";
import { User } from "../database/models/User";

const userExist = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.body) {
			const newUSer = {
				email: req.body.email,
				password: req.body.password,
			};

			const user = await User.findOne({
				where: {
					email: newUSer.email,
				},
			});
			if (user) {
				return res
					.status(409)
					.json(new HttpException("CONFLICT", "User already exist!!"));
			}
		}
		next();
	} catch (error) {
		res
			.status(500)
			.json(new HttpException("SERVER ERROR", "Something went wrong!!"));
	}
};
const userValid = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.body) {
			const { error } = userValidate(req.body);
			if (error) {
				return res.status(400).json(
					new HttpException(
						"BAD REQUEST",
						// eslint-disable-next-line no-useless-escape
						error.details[0].message.replace(/\"/g, ""),
					),
				);
			}
		}
		next();
	} catch (error) {
		res
			.status(500)
			.json(new HttpException("SERVER ERROR", "Something went wrong!!"));
	}
};

const logInValidated = (req: Request, res: Response, next: NextFunction) => {
	const error = validateLogIn(req.body);

	if (error) {
		return res.status(400).json(
			new HttpException(
				"BAD REQUEST",
				// eslint-disable-next-line no-useless-escape
				error.details[0].message.replace(/\"/g, ""),
			),
		);
	}

	next();
};

export default {
	logInValidated,
	userExist,
	userValid,
};

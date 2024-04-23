/* eslint-disable no-useless-escape */
import { userValidate } from "../validations/user.valid";
import { NextFunction, Request, Response } from "express";
import validateLogIn from "../validations/login.validation";
import { HttpException } from "../utils/http.exception";
const userValid = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.body) {
			const { error } = userValidate(req.body);
			if (error) {
				return res
					.status(400)
					.json(
						new HttpException(
							"BAD REQUEST",
							error.details[0].message.replace(/\"/g, ""),
						),
					);
			}
		}
		next();
	} catch (error) {
		res.status(500).json({
			status: "SERVER FAIL",
			message: "Something went wrong!!",
			error: error,
		});
	}
};

const logInValidated = (req: Request, res: Response, next: NextFunction) => {
	const error = validateLogIn(req.body);

	if (error) {
		return res
			.status(400)
			.json(
				new HttpException(
					"BAD REQUEST",
					error.details[0].message.replace(/\"/g, ""),
				),
			);
	}

	next();
};

export default {
	logInValidated,
	userValid,
};

import { userValidate } from "../validations/user.valid";
import { NextFunction, Request, Response } from "express";
import validateLogIn from "../validations/login.validation";
import validateReset from "../validations/reset.validation";
import { sendResponse } from "../utils/http.exception";
import validateNewPassword from "../validations/newPassword.validations";
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
				return sendResponse(
					res,
					400,
					"BAD REQUEST",
					error.details[0].message.replace(/"/g, ""),
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
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			error.details[0].message.replace(/"/g, ""),
		);
	}

	next();
};

const resetValidated = (req: Request, res: Response, next: NextFunction) => {
	const error = validateReset(req.body);

	if (error) {
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			error.details[0].message.replace(/"/g, ""),
		);
	}

	next();
};
const isPassword = (req: Request, res: Response, next: NextFunction) => {
	const error = validateNewPassword(req.body);

	if (error) {
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			error.details[0].message.replace(/"/g, ""),
		);
	}

	next();
};

export default {
	logInValidated,
	userValid,
	resetValidated,
	isPassword,
	userExist,
};

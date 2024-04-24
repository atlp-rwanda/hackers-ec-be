/* eslint-disable no-useless-escape */
import { userValidate } from "../validations/user.valid";
import { NextFunction, Request, Response } from "express";
import validateLogIn from "../validations/login.validation";
import validateReset from "../validations/reset.validation";
import { sendResponse } from "../utils/http.exception";
import validateNewPassword from "../validations/newPassword.validations";
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
};

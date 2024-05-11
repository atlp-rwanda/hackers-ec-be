/* eslint-disable no-useless-escape */
import { userValidate } from "../validations/user.valid";
import { NextFunction, Request, Response } from "express";
import validateLogIn from "../validations/login.validation";
import validateReset from "../validations/reset.validation";
import { sendResponse } from "../utils/http.exception";
import validateNewPassword from "../validations/newPassword.validations";
import updatePassValidate from "../validations/updatePass.valid";
import { userProfileValidation } from "../validations/updateUser.validation";
import accountStatusValidate from "../validations/accountStatus.validate";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../database/models/User";
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

const isUpdatePassValid = (req: Request, res: Response, next: NextFunction) => {
	const error = updatePassValidate(req.body);
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

const validateProfile = (req: Request, res: Response, next: NextFunction) => {
	const error = userProfileValidation(req.body);

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

const checkAccountStatus = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const decoded = req.user as JwtPayload;

	try {
		const error = accountStatusValidate(req.body);
		if (error) {
			return sendResponse(
				res,
				400,
				"BAD REQUEST",
				error.details[0].message.replace(/"/g, ""),
			);
		}

		const user = await User.findOne({ where: { id: decoded.id } });
		if (!user) {
			return sendResponse(
				res,
				404,
				"NOT FOUND",
				"User not found",
			);
		}
		if (user.isActive === false) {
			return sendResponse(
				res,
				403,
				"FORBIDDEN",
				"Your account has been disabled",
			);
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

export default {
	logInValidated,
	userValid,
	resetValidated,
	isPassword,
	isUpdatePassValid,
	validateProfile,
	checkAccountStatus,
};

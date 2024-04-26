import {
	validateNewRole,
	validateRoleID,
} from "../validations/role.validation";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "../utils/http.exception";

export const roleNameValid = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.body) {
			const error = validateNewRole(req.body);
			if (error) {
				return res
					.status(400)
					.json(
						new HttpException(
							"BAD REQUEST",
							error.details[0].message.replace(/"/g, " "),
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

export const roleIdValidations = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.body) {
			const error = validateRoleID(req.body);
			if (error) {
				return res
					.status(400)
					.json(
						new HttpException(
							"BAD REQUEST",
							error.details[0].message.replace(/"/g, ""),
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

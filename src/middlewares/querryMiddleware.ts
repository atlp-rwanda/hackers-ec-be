import validateQuerry from "../validations/querry.validation";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/http.exception";

const isQuerryValidated = (req: Request, res: Response, next: NextFunction) => {
	const error = validateQuerry(req.body);

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

export default isQuerryValidated;

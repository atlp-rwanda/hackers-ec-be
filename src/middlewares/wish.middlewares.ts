/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from "express";
// import { productValidation } from "../validations/product.validation";
import { sendResponse } from "../utils/http.exception";
import { wishValidation } from "../validations/wish.validation";
const isValidWish = async (req: Request, res: Response, next: NextFunction) => {
	const { error } = wishValidation.validate(req.body);

	if (error) {
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			error.details[0].message.replace(/"/g, ""),
			// error.details[0].message.replace(/\"/g, "") == "images is required"
			// 	? "Images are required"
			// 	: error.details[0].message.replace(/\"/g, ""),
		);
	}
	next();
};

export default {
	isValidWish,
};

/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from "express";
import { productValidation } from "../validations/product.validation";
import { sendResponse } from "../utils/http.exception";
import validateProductStatus from "../validations/productStatus.validation";
import database_models from "../database/config/db.config";
import { validate } from "uuid";

const isValidProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = productValidation.validate(req.body);

	if (error) {
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			error.details[0].message.replace(/\"/g, "") == "images is required"
				? "Images are required"
				: error.details[0].message.replace(/\"/g, ""),
		);
	}
	next();
};
export const isProductExist = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { productId, quantity } = req.body;

	if (!validate(productId)) {
		return sendResponse(res, 400, "BAD REQUEST", "Invalid product id");
	}

	const product = await database_models.Product.findOne({
		where: { id: productId },
	});

	if (!product) {
		return sendResponse(res, 404, "NOT FOUND", "product is not found");
	}
	if (product?.dataValues.productStatus === "Unavailable") {
		return sendResponse(res, 403, "FORBIDDEN", "product is not available");
	}
	if (product.dataValues.quantity < quantity) {
		return sendResponse(res, 404, "NOT FOUND", "Not enough quantity in stock");
	}
	next();
};

const productStatusValidated = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const error = validateProductStatus(req.body);

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
	isValidProduct,
	productStatusValidated,
};

import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/http.exception";
import { ExpandedRequest } from "./auth";
import { findUserCartById } from "../services/payment.services";
import { CartRequest } from "../types/payment";
import { cartItem } from "../types/cart";

const paymentMethods = (methods: Array<string>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { method } = req.query;
		if (!methods.includes(method as string)) {
			return sendResponse(
				res,
				402,
				"PAYMENT REQUIRED",
				"Invalid payment method! I recommend you to use stripe here!",
			);
		}
		next();
	};
};

const userHasCart = async (req: Request, res: Response, next: NextFunction) => {
	const loggedUser = (req as ExpandedRequest).user;
	const cart = await findUserCartById(loggedUser?.id);
	if (!cart) {
		return sendResponse(
			res,
			404,
			"NOT FOUND",
			"No cart found! Try adding some products in the cart.",
		);
	}
	(req as CartRequest).cart = cart;
	next();
};

const cartHasProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const cart = (req as CartRequest).cart;
	const products: cartItem[] = cart.products;
	if (products.length < 1) {
		return sendResponse(
			res,
			400,
			"BAD REQUEST",
			"You can't pay an empty cart! Please add some products!",
		);
	}
	next();
};

const TAMOUNT_NOTBELOW = (lessAmount: number = 500) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const cart = (req as CartRequest).cart;
		if (cart.total < lessAmount) {
			return sendResponse(
				res,
				400,
				"BAD REQUEST",
				`Cart total amount can't be below ${lessAmount} rwf!`,
			);
		}
		next();
	};
};

export default {
	paymentMethods,
	userHasCart,
	cartHasProducts,
	TAMOUNT_NOTBELOW,
};

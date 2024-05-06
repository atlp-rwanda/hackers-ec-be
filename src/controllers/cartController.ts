import { Request, Response } from "express";
import cartService from "../services/carts.services";
import { sendResponse } from "../utils/http.exception";

const addItemToCart = async (req: Request, res: Response) => {
	try {
		await cartService.addItem(req, res);
	} catch (error) {
		return sendResponse(res, 404, "NOT FOUND", "Product does not exists");
	}
};
const viewCart = async (req: Request, res: Response) => {
	try {
		await cartService.viewCart(req, res);
	} catch (error) {
		return sendResponse(res, 500, "ERROR", "Internal Server Error");
	}
};
const clearCart = async (req: Request, res: Response) => {
	try {
		await cartService.clearCart(req, res);
	} catch (error) {
		return sendResponse(res, 500, "ERROR", "Internal Server Error");
	}
};

const updateCart = async (req: Request, res: Response) => {
	try {
		await cartService.updateCart(req, res);
	} catch (error) {
		return sendResponse(res, 500, "ERROR", "Internal Server Error");
	}
};

export { addItemToCart, viewCart, clearCart, updateCart };

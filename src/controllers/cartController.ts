import { Request, Response } from "express";
import cartService from "../services/carts.services";
import { sendResponse } from "../utils/http.exception";

const addItemToCart = async (req: Request, res: Response) => {
	try {
		const result = await cartService.addItem(req, res);
	} catch (error) {
		return sendResponse(res, 500, "SERVER ERROR", "Something went wrong");
	}
};

export { addItemToCart };

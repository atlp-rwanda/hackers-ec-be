import { Response } from "express";

import { Product } from "../database/models/product";

import { sendResponse } from "../utils/http.exception";
import database_models from "../database/config/db.config";
import { ExpandedRequest } from "../middlewares/auth";

export default class cartService {
	static async addItem(req: ExpandedRequest, res: Response) {
		const { productId, quantity } = req.body;
		const product = await Product.findOne({ where: { id: productId } });
		if (!product) {
			return sendResponse(res, 404, "Not Found", "product is not found");
		}
		if (product.quantity < quantity) {
			return sendResponse(res, 400, "Not Found", "enough poduct in stock");
		}
		const newprice = product.price * quantity;
		const item = {
			id: product.id,
			name: product.name,
			image: product.images[0],
			quantity: quantity,
			price: product.price,
			totalPrice: newprice,
		};
		const user = (req as ExpandedRequest).user;
		const userid = user?.id;
		const cart = await database_models.Cart.findOne({
			where: { userId: userid },
		});
		if (!cart) {
			const newCart = await new database_models.Cart({
				products: [item],
				userId: userid,
				total: 0,
			});
			newCart.total = newCart.products
				.map((items: { totalPrice: number }) => items.totalPrice)
				.reduce((sum: any, next: any) => sum + next);
			await newCart.save();
			return sendResponse(res, 201, "SUCCESS", "added to cart successfully");
		}
		const itemExist = cart.products.findIndex((cItem) => cItem.id === item.id);
		if (itemExist !== -1) {
			cart.products.splice(itemExist, 1);
		}
		cart.products.push(item);
		const newTotal = cart.products
			.map((prod1) => JSON.parse(String(prod1.totalPrice)))
			.reduce((sum, next) => sum + next);
		cart.total = newTotal;
		await database_models.Cart.update(
			{ products: cart.products, total: newTotal },
			{ where: { id: cart.id } },
		);
		return sendResponse(res, 201, "SUCCESS", "Added to cart successfully");
	}
}

import { Response } from "express";

import { Product } from "../database/models/product";

import { sendResponse } from "../utils/http.exception";
import database_models from "../database/config/db.config";
import { ExpandedRequest } from "../middlewares/auth";
import UserUtils from "../utils/users";

export default class cartService {
	static async addItem(req: ExpandedRequest, res: Response) {
		const { productId, quantity } = req.body;
		const product = await Product.findOne({ where: { id: productId } });

		const newprice = product!.price * quantity;
		const item = {
			id: product!.id,
			name: product!.name,
			image: product!.images[0],
			quantity: quantity,
			price: product!.price,
			totalPrice: newprice,
		};

		const userid = UserUtils.getRequestUserId(req);

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
			.map((prod1) => prod1.totalPrice)
			.reduce((sum, next) => sum + next);
		cart.total = newTotal;
		await database_models.Cart.update(
			{ products: cart.products, total: newTotal },
			{ where: { id: cart.id } },
		);
		return sendResponse(res, 201, "SUCCESS", "Added to cart successfully");
	}
	static async viewCart(req: ExpandedRequest, res: Response) {
		const userId = UserUtils.getRequestUserId(req);
		const cart = await database_models.Cart.findOne({ where: { userId } });
		return cart
			? sendResponse(res, 200, "SUCCESS", "Cart Successfully fetched", cart)
			: sendResponse(res, 200, "SUCCESS", "Cart is empty", []);
	}
	static async clearCart(req: ExpandedRequest, res: Response) {
		const userId = UserUtils.getRequestUserId(req);
		const cart = await database_models.Cart.findOne({ where: { userId } });
		if (!cart) return sendResponse(res, 404, "ERROR", "Cart does not exist");
		cart.dataValues.products = [];
		cart.dataValues.total = 0;
		database_models.Cart.update({ ...cart.dataValues }, { where: { userId } });

		return sendResponse(res, 200, "SUCCESS", "Cart Successfully Clear", cart);
	}
	static async updateCart(req: ExpandedRequest, res: Response) {
		const userId = UserUtils.getRequestUserId(req);
		const { productId } = req.body;
		const cart = await database_models.Cart.findOne({ where: { userId } });
		if (!cart) return sendResponse(res, 404, "ERROR", "Cart does not exist");
		const itemExist = cart.products.findIndex(
			(cItem) => cItem.id === productId,
		);
		if (itemExist === -1) {
			return sendResponse(res, 404, "NOT FOUND", "Product does not exist");
		}
		const removedProduct = cart.products.splice(itemExist, 1);
		cart.total -= removedProduct[0].totalPrice;
		database_models.Cart.update({ ...cart.dataValues }, { where: { userId } });
		return sendResponse(res, 201, "SUCCESS", "Cart successfully updated", cart);
	}
}

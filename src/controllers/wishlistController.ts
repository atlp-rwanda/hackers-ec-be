import { Request, Response } from "express";
import { ExpandedRequest } from "../middlewares/auth";
import { insert_function, read_function } from "../utils/db_methods";
import {
	ProductAttributes,
	WishesAttributes,
	WishesCreationAttributes,
} from "../types/model";
import { sendResponse } from "../utils/http.exception";
import { Product } from "../database/models/product";
import { Wishes } from "../database/models/wishlist";
import sequelize from "sequelize";
import { getProductID } from "../utils/controller";

let productId: string;

const include = [
	{
		model: Product,
		as: "product",
		attributes: [
			"id",
			"name",
			"price",
			"images",
			"discount",
			"quantity",
			"categoryId",
			"sellerId",
			"expiryDate",
		],
	},
];
// create wishes
export const createWishlist = async (req: Request, res: Response) => {
	try {
		const user = (req as ExpandedRequest).user;
		const userId = user?.id;

		productId = req.body.productId;

		const wish_condition = { where: { userId, productId } };

		const productExist = await read_function<ProductAttributes>(
			"Product",
			"findOne",
			{ where: { id: productId } },
		);
		if (!productExist) {
			return sendResponse(res, 404, "NOT FOUND", "Product not found");
		}

		const wishExist = await read_function<WishesAttributes>(
			"wish",
			"findOne",
			wish_condition,
		);

		if (wishExist) {
			await read_function<WishesAttributes>("wish", "destroy", wish_condition);

			return sendResponse(
				res,
				200,
				"SUCCESS",
				"Product successfully removed from wishlist",
			);
		} else {
			const wishData: WishesCreationAttributes = {
				userId,
				productId,
			};

			const wish = await insert_function<WishesAttributes>(
				"wish",
				"create",
				wishData,
			);

			return sendResponse(
				res,
				201,
				"SUCCESS",
				"Product added successfully in wishlist!",
				wish,
			);
		}
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			error as Error,
		);
	}
};

// Get all wishes
export const getWishlist = async (req: Request, res: Response) => {
	try {
		let wishes;
		const user = (req as ExpandedRequest).user;
		const userId = user?.id;

		if (user?.role === "SELLER") {
			const wishedProduct = await Wishes.findAll({
				where: {},
				include: { model: Product, as: "product", where: { sellerId: userId } },
				attributes: [
					[
						sequelize.fn("COUNT", sequelize.col("productId")),
						"numberOfUserWishProduct",
					],
					"productId",
				],
				group: ["productId", "product.id"],
			});

			if (!wishedProduct || wishedProduct.length === 0) {
				return sendResponse(
					res,
					404,
					"NOT FOUND",
					"No products found in wishlist",
				);
			}

			return sendResponse(
				res,
				200,
				"SUCCESS",
				"Seller wishes fetched successfully!",
				wishedProduct,
			);
		} else if (user?.role === "BUYER") {
			wishes = await read_function<WishesAttributes>("wish", "findAll", {
				where: { userId },
				include,
			});

			if (Array.isArray(wishes) && wishes.length === 0) {
				return sendResponse(
					res,
					404,
					"NOT FOUND",
					"No product found in the wishlist",
				);
			}

			return sendResponse(
				res,
				200,
				"SUCCESS",
				"Buyer wishes fetched successfully from wishlist",
				wishes,
			);
		}
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			error as Error,
		);
	}
};
// Get a single wishes
const getSingleWishlist = async (req: Request, res: Response) => {
	try {
		productId = getProductID(req, res) as string;
		if (!productId) {
			return;
		}

		const user = (req as ExpandedRequest).user;
		const userId = user?.id;

		const wish = await read_function<WishesAttributes>("wish", "findOne", {
			where: { productId },
			include,
		});

		if (!wish) {
			return sendResponse(
				res,
				404,
				"NOT FOUND",
				"Product not found in the wishlist",
			);
		}

		const sellerId = wish.product?.sellerId;

		if (sellerId !== userId) {
			return sendResponse(
				res,
				404,
				"NOT FOUND",
				"product not owned by the seller",
			);
		}
		const countNumProduct = await Wishes.count({ where: { productId } });

		const sellerData = {
			numberOfUserWishProduct: countNumProduct,
			wish,
		};

		return sendResponse(
			res,
			200,
			"SUCCESS",
			"Seller product fetched successfully",
			sellerData,
		);
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			error as Error,
		);
	}
};

export default {
	getWishlist,
	getSingleWishlist,
	createWishlist,
};

import { create_checkout_session } from "../controllers/paymentController"; // Adjust the import path
import axios from "axios";
import { NextFunction, Response } from "express";
import { getToken } from "../utils/momoMethods";
import { sendResponse } from "../utils/http.exception";
import { orderItems, recordPaymentDetails } from "../services/payment.services";
import { CartRequest, MomoInfo } from "../types/payment";
import {
	MTN_MOMO_REQUEST_PAYMENT_URL,
	MTN_MOMO_SUBSCRIPTION_KEY,
	MTN_MOMO_TARGET_ENVIRONMENT,
} from "../utils/keys";
import database_models from "../database/config/db.config";
import { cartModelAttributes } from "../types/model";

jest.mock("axios");
jest.mock("../utils/momoMethods");

jest.mock("../utils/http.exception");
jest.mock("../services/payment.services");
jest.mock("../database/config/db.config", () => ({
	Cart: {
		destroy: jest.fn(),
	},
}));
describe("MTN MOMO UNIT TEST", () => {
	let req: Partial<CartRequest & MomoInfo>;
	let res: Partial<Response>;
	let next: NextFunction;

	beforeEach(() => {
		req = {
			query: { method: "momo" },
			cart: {
				id: "cart_id",
				total: 10000,
				userId: "user_id",
				products: [
					{ id: "product1", name: "Product 1", price: 5000, quantity: 1 },
					{ id: "product2", name: "Product 2", price: 5000, quantity: 1 },
				],
			} as cartModelAttributes,
			momoInfo: { XReferenceId: "reference_id" },
			user: { id: "user_id" } as any,
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should handle a successful Momo payment transaction ", async () => {
		(getToken as jest.Mock).mockResolvedValue("token");
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: "SUCCESSFUL", financialTransactionId: "transaction_id" },
		});
		(recordPaymentDetails as jest.Mock).mockResolvedValue(undefined);
		(orderItems as jest.Mock).mockResolvedValue({ order: "order_details" });
		(database_models.Cart.destroy as jest.Mock).mockResolvedValue(undefined);

		await create_checkout_session(req as any, res as Response);

		expect(getToken).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(
			`${MTN_MOMO_REQUEST_PAYMENT_URL}/reference_id`,
			{
				headers: {
					"X-Target-Environment": MTN_MOMO_TARGET_ENVIRONMENT,
					"Ocp-Apim-Subscription-Key": MTN_MOMO_SUBSCRIPTION_KEY,
					Authorization: "Bearer token",
				},
			},
		);
		expect(recordPaymentDetails).toHaveBeenCalledWith({
			payerId: "user_id",
			paymentId: "transaction_id",
			paymentMethod: "momo",
		});
		expect(orderItems).toHaveBeenCalledWith(req.cart);
		expect(database_models.Cart.destroy).toHaveBeenCalledWith({
			where: { id: "cart_id" },
		});
		expect(sendResponse).toHaveBeenCalledWith(
			res,
			200,
			"SUCCESSFUL",
			"Products are successfully paid and ordered!",
			{
				transaction: {
					status: "SUCCESSFUL",
					financialTransactionId: "transaction_id",
				},
				order: { order: "order_details" },
			},
		);
	});

	it("should handle an unsuccessful Momo payment transaction", async () => {
		(getToken as jest.Mock).mockResolvedValue("token");
		(axios.get as jest.Mock).mockResolvedValue({ data: { status: "FAILED" } });

		await create_checkout_session(req as any, res as Response);

		expect(sendResponse).toHaveBeenCalledWith(
			res,
			200,
			"FAILED",
			"Payment status is FAILED",
			{ transaction: { status: "FAILED" } },
		);
	});

	it("should handle errors during the payment process", async () => {
		(getToken as jest.Mock).mockRejectedValue(new Error("Token error"));

		await create_checkout_session(req as any, res as Response);

		expect(sendResponse).toHaveBeenCalledWith(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			"Token error",
		);
	});
});

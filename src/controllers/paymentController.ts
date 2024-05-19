/* eslint-disable no-useless-escape */
import { Request, Response } from "express";
import Stripe from "stripe";
import { ExpandedRequest } from "../middlewares/auth";
import {
	getOrCreateStripeCustomer,
	lineCartItems,
	orderItems,
	recordPaymentDetails,
} from "../services/payment.services";
import { UserModelAttributes, cartModelAttributes } from "../types/model";
import { CartRequest, PaymentDetails } from "../types/payment";
import { read_function } from "../utils/db_methods";
import { sendResponse } from "../utils/http.exception";
import { DEPLOYED_URL } from "../utils/keys";
import cartService from "../services/carts.services";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: "2024-04-10",
});

const create_checkout_session = async (req: Request, res: Response) => {
	try {
		const loggedUser = (req as ExpandedRequest).user;
		const condition = { where: { id: loggedUser?.id } };
		const user = await read_function<UserModelAttributes>(
			"User",
			"findOne",
			condition,
		);

		const cart = (req as CartRequest).cart;
		const line_items = lineCartItems(cart);
		const customer = await getOrCreateStripeCustomer(user);
		const session = await stripe.checkout.sessions.create({
			line_items,
			mode: "payment",
			payment_method_types: ["card"],
			billing_address_collection: "auto",
			customer: customer.id,
			success_url: `${DEPLOYED_URL}/api/v1/payments/success?sessionId={CHECKOUT_SESSION_ID}&payerId=${user.id}`,
			cancel_url: `${DEPLOYED_URL}/api/v1/payments/cancel`,
		});
		// res.redirect(session.url as string);
		// res.send(`<script>window.location.href = ${session.url};</script>`);
		return sendResponse(
			res,
			200,
			"SUCCESS",
			"Checkout session created successfully!",
			{ sessionUrl: session.url as string },
		);
	} catch (error) {
		console.log(error);
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			"Something went wrong!",
			(error as Error).message,
		);
	}
};

const checkout_success = async (req: Request, res: Response) => {
	try {
		const { sessionId, payerId } = req.query as {
			sessionId: string;
			payerId: string;
		};
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		const paymentId = session.payment_intent as string;
		const paymentDetails: PaymentDetails = {
			payerId,
			paymentMethod: "stripe",
			paymentId,
		};
		const cart = (await cartService.findCartByUserIdService(
			payerId,
		)) as cartModelAttributes;
		if (session.payment_status === "paid") {
			await recordPaymentDetails(paymentDetails);
			const order = await orderItems(cart);
			return sendResponse(
				res,
				200,
				"SUCCESS",
				"Products are successfully paid and ordered!",
				{ order },
			);
		}
	} catch (error) {
		return sendResponse(
			res,
			500,
			"SERVER ERROR",
			`Error handling payment success: ${(error as Error).message.replace(/\"/g, "")}`,
		);
	}
};

const checkout_cancel = (_req: Request, res: Response) => {
	return sendResponse(res, 500, "SERVER ERROR", "Payment process error!");
};

export default {
	create_checkout_session,
	checkout_success,
	checkout_cancel,
};

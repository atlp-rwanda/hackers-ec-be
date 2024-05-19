import { stripe } from "../controllers/paymentController";
import { Product } from "../database/models/product";
import { Sales } from "../database/models/sales";
import { cartItem } from "../types/cart";
import {
	OrderModelAttributes,
	PaymentsModelAttributes,
	UserModelAttributes,
	cartModelAttributes,
	salesModelAttributes,
} from "../types/model";
import { PaymentDetails } from "../types/payment";
import { insert_function, read_function } from "../utils/db_methods";

export const findUserCartById = async (userId: string) => {
	return await read_function<cartModelAttributes>("Cart", "findOne", {
		where: { userId },
	});
};

export const getOrCreateStripeCustomer = async (user: UserModelAttributes) => {
	try {
		const existingCustomer = await stripe.customers.list({ email: user.email });
		if (existingCustomer.data.length > 0) {
			return existingCustomer.data[0];
		} else {
			const customer = await stripe.customers.create({
				name: `${user.firstName} ${user.lastName}`,
				email: user.email,
				address: {
					country: user.country,
					city: user.city,
					line1: user.addressLine1,
					line2: user.addressLine2,
				},
			});
			return customer;
		}
	} catch (error) {
		console.error(
			"Error while getting or creating stripe customer:",
			(error as Error).message,
		);
		throw error;
	}
};

export const lineCartItems = (cart: cartModelAttributes) => {
	const line_items = [];
	const products: cartItem[] = cart.products;
	for (const product of products) {
		const line_item_obj = {
			price_data: {
				currency: "rwf",
				product_data: {
					name: product.name,
					images: [product.image],
				},
				unit_amount: Math.floor(product.price),
			},
			quantity: product.quantity,
		};
		line_items.push(line_item_obj);
	}
	return line_items;
};

export const recordPaymentDetails = async (paymentDetails: PaymentDetails) => {
	const paymantDetails = await insert_function<PaymentsModelAttributes>(
		"Payments",
		"create",
		paymentDetails,
	);
	if ("error" in paymantDetails) {
		throw new Error("Error while recording payment details!");
	}
	return paymantDetails;
};

export const orderItems = async (cart: cartModelAttributes) => {
	const order = await insert_function<OrderModelAttributes>("Order", "create", {
		buyerId: cart.userId,
	});
	const products = cart.products;
	const currentDate = new Date(Date.now());
	const deliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 2));

	for (const product of products) {
		const sale_data = {
			orderId: order.id,
			buyerId: cart.userId,
			productId: product.id,
			deliveryDate,
			quantitySold: product.quantity,
		};
		await insert_function<salesModelAttributes>("Sales", "create", sale_data);
	}
	return await read_function<OrderModelAttributes>("Order", "findOne", {
		where: { id: order.id },
		include: [
			{
				model: Sales,
				as: "sales",
				attributes: ["orderId", "status", "deliveryDate", "quantitySold"],
				include: [
					{
						model: Product,
						as: "soldProduct",
						attributes: ["name", "price", "images", "productStatus"],
					},
				],
			},
		],
	});
};

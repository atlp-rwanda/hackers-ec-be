import { sendEmail } from "../helpers/nodemailer";
import { findAllProducts } from "../services/products.services";
import { ProductAttributes, UserModelAttributes } from "../types/model";
import { insert_function, read_function } from "./db_methods";
import { update_product_email_template } from "./html.utils";

export const checkProductExpiration = async () => {
	const products: ProductAttributes[] = await findAllProducts();
	const expiredProducts = products.filter((product) => {
		const expirationDate = new Date(product.expiryDate);
		const currentDate = new Date();
		return (
			expirationDate <= currentDate &&
			product.quantity > 0 &&
			product.productStatus === "Available"
		);
	});

	const sellers = [
		...new Set(expiredProducts.map((product) => product.sellerId)),
	];

	for (const sellerId of sellers) {
		const sellerProducts = expiredProducts.filter(
			(product) => product.sellerId === sellerId,
		);
		const condition_one = { where: { id: sellerId } };
		const user = await read_function<UserModelAttributes>(
			"User",
			"findOne",
			condition_one,
		);
		const options = {
			to: user.email,
			subject: `Your products on Hackers have been expired.`,
			html: update_product_email_template(user, sellerProducts),
		};
		sendEmail(options);

		for (const product of sellerProducts) {
			const condition = { where: { id: product.id } };
			const productStatus = "Unavailable";
			await insert_function<ProductAttributes>(
				"Product",
				"update",
				{ productStatus },
				condition,
			);
		}
	}
};

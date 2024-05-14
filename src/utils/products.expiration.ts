import { sendEmail } from "../helpers/nodemailer";
import { findAllProducts } from "../services/products.services";
import { ProductAttributes, UserModelAttributes } from "../types/model";
import { insert_function, read_function } from "./db_methods";
import { update_product_email_template } from "./html.utils";

export const checkProductExpiration = async () => {
	const products: ProductAttributes[] = await findAllProducts();

	for (const product of products) {
		try {
			const expirationDate = new Date(product.expiryDate);
			const currentDate = new Date();
			if (
				expirationDate <= currentDate &&
				product.quantity > 0 &&
				product.productStatus === "Available"
			) {
				const condition = { where: { id: product.id } };
				const condition_one = { where: { id: product.sellerId } };
				const productStatus = "Unavailable";
				await insert_function<ProductAttributes>(
					"Product",
					"update",
					{ productStatus },
					condition,
				);
				const user = await read_function<UserModelAttributes>(
					"User",
					"findOne",
					condition_one,
				);
				const options = {
					to: user.email,
					subject: `${product.name} on Hackers has been expired.`,
					html: update_product_email_template(user, product.name),
				};
				sendEmail(options);
			}
		} catch (error) {
			console.log(error);
		}
	}
};

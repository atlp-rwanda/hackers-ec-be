import { Sequelize } from "sequelize";
import product_model from "./product";
import category_model from "./category";
import user_model from "./User";
import blacklist_model from "./blacklist";
import token_model from "./token";
import Role_model from "./role";
import reset_model from "./resetPassword";
import message_model from "./message";
import wish_model from "./wishlist";

const Models = (sequelize: Sequelize) => {
	const Product = product_model(sequelize);
	const Category = category_model(sequelize);
	const User = user_model(sequelize);
	const Blacklist = blacklist_model(sequelize);
	const Token = token_model(sequelize);
	const role = Role_model(sequelize);
	const resetPassword = reset_model(sequelize);
	const message = message_model(sequelize);
	const wish = wish_model(sequelize);

	return {
		Product,
		Category,
		User,
		Blacklist,
		Token,
		role,
		resetPassword,
		message,
		wish,
	};
};

export default Models;

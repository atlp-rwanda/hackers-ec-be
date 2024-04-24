import { hashPassword } from "../utils/password";
import database_models from "../database/config/db.config";
import { UserInt } from "../types/services";

export const createUser = async (data: UserInt) => {
	return await database_models.User.create({
		email: data.email.trim(),
		password: await hashPassword(data.password),
		confirmPassword: await hashPassword(data.password),
		userName: data.userName == null ? data.email.split("@")[0] : data.userName,
		firstName: data.firstName,
		lastName: data.lastName,
		role: "SELLER",
		isVerified: false,
	});
};

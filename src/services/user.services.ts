import { hashPassword } from "../utils/password";
import { User } from "../database/models/User";
interface UserInt {
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: string;
}
export const createUser = async (data: UserInt) => {
	return User.create({
		email: data.email.trim(),
		password: await hashPassword(data.password),
		confirmPassword: await hashPassword(data.password),
		userName: data.userName == null ? data.email.split("@")[0] : data.userName,
		firstName: data.firstName,
		lastName: data.lastName,
		role: "BUYER",
	});
};

import { UserModelAttributes, roleModelAttributes } from "../types/model";
import { read_function, insert_function } from "../utils/db_methods";
import { generateAccessToken } from "../helpers/security.helpers";
import { Response } from "express";
import { BASE_URL } from "../utils/keys";

export async function handleUserLogin(
	res: Response,
	userExist: UserModelAttributes,
) {
	const role = await read_function<roleModelAttributes>("role", "findOne", {
		where: { id: userExist.role },
	});

	const token = generateAccessToken({
		id: userExist.id,
		role: role.roleName,
	});

	return res.redirect(
		`${BASE_URL}/google?token=${token}&message=${`Logged in to you account successfully!`}`,
	);
}

export async function handleNewUser(
	res: Response,
	userData: UserModelAttributes,
) {
	const newUser = await insert_function<UserModelAttributes>("User", "create", {
		...userData,
	});

	const role = await read_function<roleModelAttributes>("role", "findOne", {
		where: { id: newUser.role },
	});

	const token = generateAccessToken({
		id: newUser.id,
		role: role.roleName,
	});

	return res.redirect(
		`${BASE_URL}/google?token=${token}?message=${`Account Created successfully!`}`,
	);
}

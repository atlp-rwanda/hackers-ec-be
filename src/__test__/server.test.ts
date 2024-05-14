import app from "../app";
import request from "supertest";
import { deleteTableData } from "../utils/database.utils";
import { User } from "../database/models/User";
import { forgotPassword } from "../controllers/resetPasswort";
import { resetPasswort } from "../controllers/resetPasswort";

import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import {
	bad_two_factor_authentication_data,
	login_user,
	login_user_br,
	login_user_invalid_email,
	login_user_wrong_credentials,
	NewUser,
	partial_two_factor_authentication_data,
	two_factor_authentication_data,
	user_bad_request,
	newPasswordBody,
	NotUserrequestBody,
	sameAsOldPassword,
	new_pass_equals_old_pass,
	new_pass_not_equals_confirm_pass,
	update_with_wrong_old_pass,
	update_pass,
	disable_user,
	enable_user,
	account_status_invalid,
} from "../mock/static";
import { generateAccessToken } from "../helpers/security.helpers";
import { resetPassword } from "../database/models/resetPassword";
import { read_function } from "../utils/db_methods";

jest.mock("../utils/db_methods", () => ({
	read_function: jest.fn(),
}));

jest.setTimeout(30000);

const role = database_models["role"];
const user = database_models["User"];

jest.setTimeout(30000);
function logErrors(
	err: { stack: any },
	_req: any,
	_res: any,
	next: (arg0: any) => void,
) {
	console.log(err.stack);
	next(err);
}
let token: string;

const Jest_request = request(app.use(logErrors));

let resetToken = "";
let id: string;
const admin_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwYTg2MDNjLWE2YWQtNGFlOS05NWFkLWVjMmRmYjk4OTI1MiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcxNTYxMTQ1OSwiZXhwIjoxNzQ3MTY5MDU5fQ.IPu81R6tOtgKwFmVQthkCyElECya1vMsfFEcn88zzB0";
let userId: string;

describe("USER SERVER API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
		const adminRole = await role.findOne({ where: { roleName: "ADMIN" } });

		if (adminRole) {
			id = adminRole?.dataValues.id;
		}
		const userStatus = await user.findOne({
			where: { role: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
		});
		if (userStatus) {
			userId = userStatus?.dataValues.id;
		}
	});

	afterAll(async () => {
		await deleteTableData(database_models.Token, "tokens");
		await deleteTableData(database_models.User, "users");
	});

	it("should return 500 when something goes wrong on authenticate the user", async () => {
		const authenticatetoken = generateAccessToken({
			id: "1",
			role: "seller",
			otp: two_factor_authentication_data.otp,
		});

		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.post(
			`/api/v1/users/2fa/${authenticatetoken}`,
		)
			.send(two_factor_authentication_data)
			.expect(500);

		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toStrictEqual("Something went wrong!");
	});

	it("should return 500 when something went wrong on disabling users", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.patch(
			`/api/v1/users/${userId}/account-status`,
		)
			.set("Authorization", `Bearer ${admin_token}`)
			.send(disable_user)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});

	it("should return 500 when something went wrong on listing all users", async () => {
		(read_function as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

		const { body } = await Jest_request.get("/api/v1/users")
			.set("Authorization", `Bearer ${admin_token}`)
			.expect(500);
		expect(body.status).toStrictEqual("SERVER ERROR");
		expect(body.message).toBe("Something went wrong!");
	});
});

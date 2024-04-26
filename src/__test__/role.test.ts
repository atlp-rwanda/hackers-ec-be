import app from "../app";
import request from "supertest";
import { connectionToDatabase } from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import database_models from "../database/config/db.config";
import { roleAdmin, mockRole, mockRoleBuyer, NewUser } from "../mock/static";
import { log } from "console";
import { ACCESS_TOKEN_SECRET } from "../utils/keys";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { Token } from "../database/models/token";

interface ExpandedRequest extends Request {
	UserId?: JwtPayload;
}

function logErrors(
	err: { stack: any },
	_req: any,
	_res: any,
	next: (arg0: any) => void,
) {
	console.log(err.stack);
	next(err);
}
const role = database_models["role"];
const user = database_models["User"];
const Jest_request = request(app.use(logErrors));
let id: string;
let roleId: string;
let token = "";
let userId: string;

jest.setTimeout(30000);

describe("ROLE API TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
		await role.create({ ...roleAdmin });
		const adminRole = await role.findOne({ where: { roleName: "ADMIN" } });
		if (adminRole) {
			id = adminRole?.dataValues.id;
		}
	});

	afterAll(async () => {
		await deleteTableData(database_models.User, "users");
		// await deleteTableData(database_models.role, "roles");
	});

	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(NewUser)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Plase Verify your Account",
		);

		const tokenRecord = await Token.findOne();
		token = tokenRecord?.dataValues.token ?? "";
	});

	it("should successfully login a user and return 200", async () => {
		const loginUser = {
			email: NewUser.email,
			password: NewUser.password,
		};

		await database_models.User.update(
			{ isVerified: true, role: "12afd4f1-0bed-4a3b-8ad5-0978dabf8fcd" },
			{ where: { email: loginUser.email } },
		);

		const { body } = await Jest_request.post("/api/v1/users/login")
			.send(loginUser)
			.expect(200);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual("Login successfully!");
		expect(body.token).toBeDefined();
		token = body.token;
		console.log(body);
	});

	it("it should return all  role  and return 200 ", async () => {
		const { body } = await Jest_request.get("/api/v1/roles/").set(
			"Authorization",
			`Bearer ${token}`,
		);
		expect(body.message).toStrictEqual("we have following roles");
		expect(body.roles).toBeDefined();
	});

	it("it create role  and return 201 ", async () => {
		const { body } = await Jest_request.post("/api/v1/roles/")
			.set("Authorization", `Bearer ${token}`)
			.send(mockRole);
		expect(body.message).toStrictEqual("Role created successfully");
		expect(body.response).toBeDefined();
	});

	it("it should return role already exist and return 409 ", async () => {
		const mockRoleExist = {
			roleName: "ADMIN",
		};
		const { body } = await Jest_request.post("/api/v1/roles/")
			.set("Authorization", `Bearer ${token}`)
			.send(mockRoleExist);
		expect(body.message).toStrictEqual("role already exist");
		expect(body.status).toStrictEqual(409);
	});

	it("it should return role not found and return 404 ", async () => {
		const roleObj = {
			roleId: "ad80d123-dc7d-41b8-928b-b7f51532cacd",
		};
		userId = "7121d946-7265-45a1-9ce3-3da1789e657e";
		const { body } = await Jest_request.post(`/api/v1/users/${userId}/roles`)
			.set("Authorization", `Bearer ${token}`)
			.send(roleObj);
		expect(body.message).toStrictEqual("role not found");
	});

	it("it should assign user to role  and return 201 ", async () => {
		const roleObj = {
			roleId: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
		};
		userId = "7121d946-7265-45a1-9ce3-3da1789e657e";
		const { body } = await Jest_request.post(`/api/v1/users/${userId}/roles`)
			.set("Authorization", `Bearer ${token}`)
			.send(roleObj);
		expect(body.message).toStrictEqual("Role assigned successfully!");
	});

	it("it should return please login and return 401 ", async () => {
		const roleObj = {
			roleId: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
		};
		const notuserId = "ad80d123-dc7d-41b8-928b-b7f51532cacd";
		const nulltoken = "";
		const { body } = await Jest_request.post(`/api/v1/users/${notuserId}/roles`)
			.set("Authorization", `Bearer ${nulltoken}`)
			.send(roleObj);
		expect(body.message).toStrictEqual("Please Login Again");
	});

	it("it should return Invalid token and return 403 ", async () => {
		const roleObj = {
			roleId: "ad80d123-dc7d-41b8-928b-b7f51532cacd",
		};
		const notuserId = "ad80d123-dc7d-41b8-928b-b7f51532cacd";
		const Invalidtoken =
			"eieefdfeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEwNzk0NjVhLTdkNzEtNDQ5ZC04NDY0LWEyNmU4NmVhMDdjNyIsInJvbGUiOiIxMmFmZDRmMS0wYmVkLTRhM2ItOGFkNS0wOTc4ZGFiZjhmY2QiLCJpYXQiOjE3MTQyNDE5ODQsImV4cCI6MTcxNDMyODM4NH0.Z6iTlnHSfdWmPU73TRdgmHiMk-Icxy1QlTqlTIE_WX8inieoncee";
		const { body } = await Jest_request.post(`/api/v1/users/${notuserId}/roles`)
			.set("Authorization", `Bearer ${Invalidtoken}`)
			.send(roleObj);
		expect(body.message).toStrictEqual("Invalid token,Try Login Again");
	});

	it("it should return updated succefully and return 201 ", async () => {
		//const id = "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd";
		const roleNewName = {
			roleName: "ENDUSER",
		};
		const { body } = await Jest_request.patch(`/api/v1/roles/${id}`)
			.set("Authorization", `Bearer ${token}`)
			.send(roleNewName);
		expect(body.message).toStrictEqual("Role updated successfully");
	});
});

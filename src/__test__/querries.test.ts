import app from "../app";
import request from "supertest";
import database_models, {
	connectionToDatabase,
} from "../database/config/db.config";
import { deleteTableData } from "../utils/database.utils";
import { NewUser } from "../mock/static";
import { v4 as uuidV4 } from "uuid";
import { Token } from "../database/models/token";
import { log } from "console";

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

const Jest_request = request(app.use(logErrors));

let token = "";
let querryId: string;

describe("QUERRIES TEST", () => {
	beforeAll(async () => {
		await connectionToDatabase();
	});
	afterAll(async () => {
		await deleteTableData(database_models.User, "users");
		await deleteTableData(database_models.Querries, "querries");
		await deleteTableData(database_models.Token, "tokens");
	});
	it("it should  register a user and return 201", async () => {
		const { body } = await Jest_request.post("/api/v1/users/register")
			.send(NewUser)
			.expect(201);
		expect(body.status).toStrictEqual("SUCCESS");
		expect(body.message).toStrictEqual(
			"Account Created successfully, Please Verify your Account",
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
		expect(body.data).toBeDefined();
		token = body.data;
	});

	// =================================QUERRIES TESTS================================

	it("It should create querry when customer want to communicate to app owner", async () => {
		const newQuerry = {
			firstName: "Izanyibuka",
			lastName: "Yvette",
			subject: "Biiter",
			email: "izanyibukayvette@gmail.com",
			message: "I hated this app",
		};
		const { body } = await Jest_request.post("/api/v1/querries")
			.send(newQuerry)
			.expect(201);
		expect(body.status).toStrictEqual("CREATED");
		querryId = body.data.id;
	});

	it("It should return all querries", async () => {
		const { body } = await Jest_request.get("/api/v1/querries").set(
			"Authorization",
			`Bearer ${token}`,
		);
	});
	it("It should return a single querry", async () => {
		const { body } = await Jest_request.get(`/api/v1/querries/${querryId}`).set(
			"Authorization",
			`Bearer ${token}`,
		);
	});
});

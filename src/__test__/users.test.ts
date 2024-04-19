import app from "../app";
import request from "supertest";
// import { connectionToDatabase } from "../database/config/db.config";

jest.setTimeout(30000);

describe("USER API TEST", () => {
	// beforeAll(async () => {
	//   await connectionToDatabase();
	// });

	it("Should return 200 and list of all users", async () => {
		// Your test implementation goes here
	});

	it("should create a new user", async () => {
		// Your test implementation goes here
	});

	it("should return validation errors when required fields are missing", async () => {
		// Your test implementation goes here
	});

	it("should return an error if the email is already in use", async () => {
		// Your test implementation goes here
	});
});

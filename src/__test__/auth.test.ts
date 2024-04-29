import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../middlewares/auth";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/keys";

// Define the UserId interface
interface UserId {
	userId: string;
}

// Define the ExpandedRequest interface extending the Request interface
interface ExpandedRequest extends Request {
	UserId?: UserId;
}

// Mocking jwt.verify to return a valid token payload
jest.mock("jsonwebtoken", () => ({
	verify: jest.fn().mockReturnValue({ userId: "123456789" }),
	decode: jest.fn().mockReturnValue({ exp: Date.now() + 3600 }),
}));

jest.setTimeout(10000);

describe("authenticateUser middleware", () => {
	let req: ExpandedRequest;
	let res: Response;
	let next: NextFunction;

	beforeEach(() => {
		req = {
			headers: {
				authorization: "Bearer validMockJWTToken",
			},
		} as unknown as ExpandedRequest;

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response;

		next = jest.fn() as NextFunction;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should authenticate user and call next function with valid token", async () => {
		await authenticateUser(req, res, next);

		expect(jwt.verify).toHaveBeenCalledWith("validMockJWTToken", JWT_SECRET);
		expect(req.UserId).toEqual({ userId: "123456789" });
		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
	});

	it("should return 401 if token is missing", async () => {
		delete req.headers.authorization;

		await authenticateUser(req, res, next);

		expect(jwt.verify).not.toHaveBeenCalled();
		expect(req.UserId).toBeUndefined();
		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
	});
});

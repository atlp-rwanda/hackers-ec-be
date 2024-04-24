import { Blacklist } from "../database/models/blacklist";
import { HttpException } from "../utils/http.exception";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const logout = async (req: Request, res: Response) => {
	try {
		const token = req.params.token;
		console.log(token);

		if (!token) {
			return res
				.status(404)
				.json(new HttpException("NOT FOUND", "Token Not Found"));
		}

		const blacklistedToken = await Blacklist.findOne({ where: { token } });

		if (!blacklistedToken) {
			await Blacklist.create({ id: uuidv4(), token: token });
			return res
				.status(201)
				.json(new HttpException("CREATED", "Logged out successfully"));
		}

		return res
			.status(401)
			.json(new HttpException("UNAUTHORIZED", "Already logged out"));
	} catch (error) {
		console.error("Error during logout:", error);
		return res
			.status(500)
			.json(
				new HttpException(
					"INTERNAL_SERVER_ERROR",
					"An internal server error occurred",
				),
			);
	}
};

export default logout;

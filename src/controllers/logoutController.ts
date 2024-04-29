import { Blacklist } from "../database/models/Blacklist";
import { HttpException } from "../utils/http.exception";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const logout = async (req: Request, res: Response) => {
	try {
		const token = req.header("Authorization")?.split(" ")[1];

		if (token) {
			const blacklistedToken = await Blacklist.findOne({ where: { token } });

			if (!blacklistedToken) {
				await Blacklist.create({ id: uuidv4(), token: token });
				return res
					.status(201)
					.json(new HttpException("CREATED", "Logged out successfully"));
			}
		}

		return res
			.status(401)
			.json(new HttpException("UNAUTHORIZED", "Already logged out"));
	} catch (error) {
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

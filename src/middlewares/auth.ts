import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET } from "../utils/keys";
import database_models from "../database/config/db.config";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { HttpException } from "../utils/http.exception";

export interface ExpandedRequest extends Request {
	user?: JwtPayload;
}

// only logged in users
const authenticateUser = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json({ status: "UNAUTHORIZED", message: "Please login to continue" });
	}
	//checking token expiration
	const decoded = jwt.decode(token) as JwtPayload;
	if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
		return res
			.status(401)
			.json({ message: "Token has expired, please login again!" });
	}

	try {
		const verifiedToken = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;
		const isInBlcaklist = await database_models.Blacklist.findOne({
			where: { token },
		});

		if (!verifiedToken || isInBlcaklist) {
			return res.status(401).json({ message: "please login to continue!" });
		}

		req.user = verifiedToken;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return res
				.status(401)
				.json({ message: "Token has expired, please login again!" });
		} else if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ message: "Invalid token!" });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
};

// only buyers
const isBuyer = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	try {
		const decoded = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;

		if (!decoded) {
			return res.status(401).json({ message: "please login to continue!" });
		}

		if (decoded.role !== "BUYER") {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

const isSeller = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
	}

	const decodedToken = jwt.decode(token) as JwtPayload;
	if (
		decodedToken &&
		decodedToken.exp &&
		Date.now() >= decodedToken.exp * 1000
	) {
		return res
			.status(401)
			.json(
				new HttpException(
					"UNAUTHORIZED",
					"You have been loggedOut, Please login to continue!",
				),
			);
	}

	try {
		const payLoad = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;

		if (!payLoad) {
			return res
				.status(401)
				.json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
		}

		req.user = payLoad;

		if (req.user?.role != "SELLER") {
			return res
				.status(403)
				.json(
					new HttpException(
						"FORBIDDEN",
						" Only seller can perform this action!",
					),
				);
		}

		next();
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			return res
				.status(401)
				.json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
		} else {
			return res
				.status(401)
				.json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
		}
	}
};

//only admins
const isAdmin = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Please Login Again" });
	}
	try {
		const decoded = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as JwtPayload;
		if (!decoded) {
			return res.status(401).json({ message: "Expired token,Try Login Again" });
		}
		const role = decoded.role;
		if (role) {
			if (role === "ADMIN") {
				next();
			} else {
				return res
					.status(403)
					.json({ message: "you are not allowed to access this route!" });
			}
		}
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ message: "Invalid token,Try Login Again" });
		} else {
			return res
				.status(500)
				.json({ message: "Internal server error", error: error });
		}
	}
};

export default {
	authenticateUser,
	isBuyer,
	isSeller,
	isAdmin,
};

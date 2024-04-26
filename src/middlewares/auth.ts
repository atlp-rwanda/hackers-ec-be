import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Blacklist } from "../database/models/blacklist";
// import { userRole } from "../database/models/userroles";
// import { userRoleModelAttributes } from "../database/models/userroles";
import { ACCESS_TOKEN_SECRET } from "../utils/keys";
import database_models from "../database/config/db.config";
const Role = database_models["role"];
const User = database_models["User"];

interface ExpandedRequest extends Request {
	UserId?: JwtPayload;
}

// only logged in users
export const authenticateUser = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
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
		const isInBlcaklist = await Blacklist.findOne({ where: { token } });

		if (!verifiedToken && isInBlcaklist) {
			return res.status(401).json({ message: "please login to continue!" });
		}

		req.UserId = verifiedToken;
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
export const isBuyer = async (
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

		if (decoded.role !== "buyer") {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

//only vendors
export const isVendor = async (
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

		if (decoded.role !== "vendor") {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

//only admins auth
export const isAdmin = async (
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
		const role = await User.findOne({
			where: { id: decoded.id },
			include: { model: Role, as: "Roles" },
		});
		if (role) {
			const x = role.toJSON() as unknown as { Roles: { roleName: string } };
			if (x.Roles.roleName === "ADMIN") {
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

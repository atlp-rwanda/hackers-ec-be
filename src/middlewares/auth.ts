import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/keys";
import { Blacklist } from "../database/models/blacklist";
import { userRole } from "../database/models/userroles";
import { userRoleModelAttributes } from "../database/models/userroles";
import { Role } from "../database/models/roles";
import { User } from "../database/models/User";
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

//only admins

export const isAdmin = async (
	req: ExpandedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).json({ message: "please login again" });
	}
	try {		
		const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as JwtPayload;
		if (!decoded) {
			return res.status(401).json({ message: "inavlid token , please login to continue!" });
		}
	
		const userrole= await userRole.findOne({where:{
			userId:decoded.id
		}})
 		if(!userrole){
			const buyerRoleid=await User.findOne({where:{
				id:decoded.id
			}})
			const roleName= await Role.findOne({where:{
				id:buyerRoleid?.role
			}})
			if(roleName?.dataValues.roleName==="BUYER"){

				return res.status(403).json({ message: "BUYER can not create Role" });

			}
			
		  }
	  		if (userrole?.dataValues.roleName!=="ADMIN") {
			return res.status(403).json({ message: "forbidden" });
		    }
		next();
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

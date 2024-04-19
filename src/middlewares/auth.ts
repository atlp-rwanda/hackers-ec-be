import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/keys";

interface ExpandedRequest extends Request {
    UserId?: JwtPayload;
}

// only logged in users
export const authenticateUser = (req: ExpandedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    //checking token expiration

    const decoded = jwt.decode(token) as JwtPayload;
    if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({ message: "Token has expired, please login again!" });
    }

    try {
        const verifiedToken = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        if (!verifiedToken) {
            return res.status(401).json({ message: "please login to continue!" });
        }

        req.UserId = verifiedToken;
        next();
        
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token has expired, please login again!" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token!" });
        }else {
            return res.status(500).json({ message: "Internal server error" });
        }

    }
};


// only buyers
export const isBuyer = (req: ExpandedRequest, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
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
export const isVendor = (req: ExpandedRequest, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
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
export const isAdmin = (req: ExpandedRequest, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        if (!decoded) {
            return res.status(401).json({ message: "please login to continue!" });
        }

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "forbidden" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

interface Result {
	valid: boolean;
	reason?: string;
	user?: JwtPayload;
}
export const validateToken = (
	token: string | undefined,
	secretKey: string
): Result => {
	try {
		if (!token) {
			return {
				valid: false,
				reason: "Unauthorized, Please login to continue!"
			};
		}

		const decodedToken = jwt.verify(token, secretKey) as JwtPayload;

		if (decodedToken) return { valid: true, user: decodedToken };

		return { valid: true };
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			return {
				valid: false,
				reason: "Unauthorized, Please login to continue!"
			};
		} else {
			return {
				valid: false,
				reason: "Unexpected error, Please login to continue!"
			};
		}
	}
};

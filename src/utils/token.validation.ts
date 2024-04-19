import jwt, { JsonWebTokenError } from "jsonwebtoken";

interface Result {
  valid: boolean;
  reason?: string;
}
export const validateToken = (
  token: string | undefined,
  secretKey: string
): Result => {
  try {
    if (!token)
      return {
        valid: false,
        reason: "Unauthorized, Please login to continue!",
      };

    const decodedToken = jwt.verify(token, secretKey);

    if (decodedToken) return { valid: true };

    return { valid: true };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return {
        valid: false,
        reason: "Unauthorized, Please login to continue!",
      };
    } else {
      return {
        valid: false,
        reason: "Unexpected error, Please login to continue!",
      };
    }
  }
};

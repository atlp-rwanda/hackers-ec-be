import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/keys";

interface TokenData {
  id: string | number;
  role: string;
}

export const generateAccessToken = (userData: TokenData) => {
  const token = jwt.sign(userData, ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
};

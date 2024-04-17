import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./keys";

export const generateToken=(payload:any) => {
 // const token = jwt.sign({}, JWT_SECRET as string);
 const token=jwt.sign({ id: payload.id,Role:payload.email }, JWT_SECRET || " ", { expiresIn: '120min' }); 
 
 return token;
}
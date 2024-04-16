import express from "express";
import { getUsers,registerUser } from "../controllers/userController";
import { userEXist,userValid } from "../middlewares/user.middleware";

const userRoutes = express.Router();

userRoutes.get("/users", getUsers);
userRoutes.post("/register",userValid,userEXist,registerUser);

export default userRoutes;

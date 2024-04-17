import express from "express";
import { userEXist,userValid } from "../middlewares/user.middleware";
import userController from "../controllers/userController";

const userRoutes = express.Router();

userRoutes.get("/users", userController.getUsers);
userRoutes.post("/users/register",userValid,userEXist,userController.registerUser);
userRoutes.post("/login", userController.login);

export default userRoutes;

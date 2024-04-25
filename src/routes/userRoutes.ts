import express from "express";
import userController from "../controllers/userController";
import userMiddleware from "../middlewares/user.middleware";

const userRoutes = express.Router();
userRoutes.post(
	"/register",
	userMiddleware.userValid,
	userController.registerUser
);

userRoutes.post("/login", userMiddleware.logInValidated, userController.login);

userRoutes.get("/account/verify/:token", userController.accountVerify);

export default userRoutes;

import express from "express";
import userController from "../controllers/userController";
import userMiddleware from "../middlewares/user.middleware";
import logout from "../controllers/logoutController";

const userRoutes = express.Router();
userRoutes.post(
	"/register",
	userMiddleware.userValid,
	userController.registerUser,
);

userRoutes.post("/login", userMiddleware.logInValidated, userController.login);
userRoutes.post("/logout/:token", logout);

export default userRoutes;

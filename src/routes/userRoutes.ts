import express from "express";
import userController from "../controllers/userController";
import userMiddleware from "../middlewares/user.middleware";
import logout from "../controllers/logoutController";
import otpIsValid from "../middlewares/otp";

const userRoutes = express.Router();
userRoutes.post(
	"/register",
	userMiddleware.userValid,
	userController.registerUser,
);

userRoutes.post("/login", userMiddleware.logInValidated, userController.login);

userRoutes.post("/logout", logout);
userRoutes.get("/account/verify/:token", userController.accountVerify);

userRoutes.post(
	"/2fa/:token",
	otpIsValid,
	userController.two_factor_authentication,
);

export default userRoutes;

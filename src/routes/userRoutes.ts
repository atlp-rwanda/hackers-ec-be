import express from "express";
import userController from "../controllers/userController";
import userMiddleware from "../middlewares/user.middleware";
import logout from "../controllers/logoutController";
import otpIsValid from "../middlewares/otp";
import { resetPasswort, forgotPassword } from "../controllers/resetPasswort";

const userRoutes = express.Router();
userRoutes.post(
	"/register",
	userMiddleware.userValid,
	userController.registerUser,
);

userRoutes.post("/login", userMiddleware.logInValidated, userController.login);

userRoutes.post("/logout", logout);
userRoutes.post(
	"/forgot-password",
	userMiddleware.resetValidated,
	forgotPassword,
);
userRoutes.post(
	"/reset-password/:token",
	userMiddleware.isPassword,
	resetPasswort,
);
userRoutes.get("/account/verify/:token", userController.accountVerify);

userRoutes.post(
	"/2fa/:token",
	otpIsValid,
	userController.two_factor_authentication,
);
userRoutes.get("/auth/google", userController.googleAuthInit);

userRoutes.get("/auth/google/callback", userController.handleGoogleAuth);

export default userRoutes;

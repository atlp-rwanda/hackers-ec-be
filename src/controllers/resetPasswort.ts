import { Request, Response } from "express";
import { User } from "../database/models/User";
import { ACCESS_TOKEN_SECRET, PORT } from "../utils/keys";
import { generateAccessToken } from "../helpers/security.helpers";
import { resetPassword } from "../database/models/resetPassword";
import Jwt from "jsonwebtoken";
import { sendEmail } from "../helpers/nodemailer";
import { hashPassword } from "../utils/password";
import { resetTokenData } from "../helpers/security.helpers";
import { isValidPassword } from "../utils/password.checks";

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		const isUserExist: User | null = await User.findOne({
			where: { email: email },
		});

		if (!isUserExist) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const resetToken = generateAccessToken({
			id: isUserExist?.dataValues.id,
			role: isUserExist?.dataValues.role,
			email: isUserExist?.dataValues.email,
		});

		await resetPassword.destroy({
			where: { email: email },
		});

		await resetPassword.create({
			resetToken: resetToken,
			email: email,
		});

		const host = process.env.BASE_URL || `http://localhost:${PORT}`;
		const confirmlink: string = `${host}/passwordReset?token=${resetToken}`;

		const mailOptions = {
			to: email,
			subject: "Reset Password",
			html: `
                <p>Click <a href="${confirmlink}">here</a> to reset your password</p>
            `,
		};

		await sendEmail(mailOptions);

		res
			.status(200)
			.json({ message: "Email sent successfully", status: "SUCCESS" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "An error occurred while requesting password reset." });
	}
};

export const resetPasswort = async (req: Request, res: Response) => {
	try {
		const { password } = req.body!;
		const { token } = req.params;

		const tokenAvailability = await resetPassword.findOne({
			where: { resetToken: token },
		});

		if (!tokenAvailability) {
			return res.status(400).json({ message: "Invalid link" });
		}

		const decoded = Jwt.verify(token, ACCESS_TOKEN_SECRET!) as resetTokenData;

		if (!decoded || !decoded.id) {
			return res.status(404).json({
				message: "Invalid link",
			});
		}
		const resettingUser = await User.findOne({ where: { id: decoded.id! } });

		const sameAsOldPassword = await isValidPassword(
			password,
			resettingUser?.dataValues.password as string,
		);

		if (sameAsOldPassword) {
			return res
				.status(400)
				.json({ message: "Password cannot be the same as the old password" });
		}

		const hashedPassword: string = (await hashPassword(password)) as string;

		await resettingUser?.update({ password: hashedPassword });

		await resetPassword.destroy({ where: { resetToken: token } });
		res.status(200).json({ message: "Password reset successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "An error occurred while resetting password." });
	}
};

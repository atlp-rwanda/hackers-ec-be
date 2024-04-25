import { Request } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../database/models/User";
import { isValidPassword } from "../utils/password.checks";
import { hashPassword } from "../utils/password";

export interface CustomVerifyOptions {
	message: string;
	status: string;
	statusNumber?: number;
}
passport.serializeUser(function (user: any, done) {
	done(null, user);
});

passport.deserializeUser(function (user: any, done) {
	done(null, user);
});

passport.use(
	"signup",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true
		},
		async (req, email, password, done) => {
			try {
				const data = {
					email: email.trim(),
					password: await hashPassword(password),
					confirmPassword: await hashPassword(req.body.confirmPassword),
					userName:
						req.body.userName == null
							? req.body.email.split("@")[0]
							: req.body.userName,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					role: "BUYER",
					isVerified: false
				};
				const userEXist = await User.findOne({
					where: {
						email: data.email
					}
				});
				if (userEXist) {
					const options: CustomVerifyOptions = {
						statusNumber: 409,
						message: "User already exist!",
						status: "CONFLICT"
					};
					return done(null, false, options);
				}
				const user = await User.create({ ...data });
				done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	"login",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true
		},
		async (_req: Request, email, password, done) => {
			try {
				const user = await User.findOne({ where: { email } });

				if (!user) return done(null, false, { message: "Wrong credentials!" });
				if (!user.dataValues.isVerified) {
					return done(null, false, { message: "Verify your Account" });
				}

				const currPassword = user.dataValues.password;

				const isValidPass = await isValidPassword(password, currPassword);

				if (!isValidPass) {
					return done(null, false, { message: "Wrong credentials!" });
				}

				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);

export default passport;

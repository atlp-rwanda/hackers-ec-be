import { Request } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User, UserModelAttributes } from "../database/models/User";
import { hashPassword } from "../utils/password";
import { isValidPassword } from "../utils/password.checks";
import GooglePassport, { VerifyCallback } from "passport-google-oauth20";
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_SECRET_ID,
	GOOGLE_CALLBACK_URL,
} from "../utils/keys";
import { v4 as uuidv4 } from "uuid";

const GoogleStrategy = GooglePassport.Strategy;

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
			passReqToCallback: true,
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
					isVerified: false,
				};
				const userEXist = await User.findOne({
					where: {
						email: data.email,
					},
				});
				if (userEXist) {
					return done(null, false, { message: "User already exist!" });
				}
				const user = await User.create({ ...data });
				done(null, user);
			} catch (error) {
				done(error);
			}
		},
	),
);

passport.use(
	"login",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (_req: Request, email, password, done) => {
			try {
				const user = await User.findOne({ where: { email } });

				if (!user) return done(null, false, { message: "Wrong credentials!" });

				const currPassword = user.dataValues.password;

				const isValidPass = await isValidPassword(password, currPassword);

				if (!isValidPass) {
					return done(null, false, { message: "Wrong credentials!" });
				}

				if (!user.dataValues.isVerified) {
					return done(null, false, { message: "Verify your Account" });
				}
				return done(null, user);
			} catch (error) {
				done(error);
			}
		},
	),
);
interface GoogleProfileData {
	id: string;
	name: {
		givenName: string;
		familyName: string;
	};
	emails: Array<{ value: string }>;
}
const userProfile = (profile: GoogleProfileData): UserModelAttributes => {
	const { name, emails } = profile;

	const user = {
		id: uuidv4(),
		userName: emails[0].value.split("@")[0],
		firstName: name.givenName,
		lastName: name.familyName,
		email: emails[0].value,
		role: "BUYER",
		password: "",
		confirmPassword: "",
		isVerified: false,
	};

	return user;
};

passport.use(
	"google",
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_SECRET_ID,
			callbackURL: GOOGLE_CALLBACK_URL,
			scope: ["profile", "email"],
			passReqToCallback: true,
		},
		(
			_req: Request,
			_accessToken: string,
			_refreshToken: string,
			profile: any,
			cb: VerifyCallback,
		) => {
			cb(null, userProfile(profile));
		},
	),
);

export default passport;

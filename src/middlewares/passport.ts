import { Request } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
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
import database_models from "../database/config/db.config";
import { UserModelAttributes } from "../types/model";

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
				const role = await database_models.role.findOne({
					where: { roleName: "BUYER" },
				});
				if (!role) {
					return done(null, false, { message: "you are assigned to no role" });
				}
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
					role: role?.dataValues.id as string,
					isVerified: false,
				};
				const userExist = await database_models.User.findOne({
					where: {
						email: data.email,
					},
				});
				if (userExist) {
					return done(null, false, { message: "User already exist!" });
				}
				const user = await database_models.User.create({ ...data });
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
				const user = await database_models.User.findOne({
					where: { email },
					include: [
						{
							model: database_models.role,
							as: "Roles",
						},
					],
				});

				const my_user = user?.toJSON();

				if (!user) return done(null, false, { message: "Wrong credentials!" });

				const currPassword = my_user?.password as string;

				const isValidPass = await isValidPassword(password, currPassword);

				if (!isValidPass) {
					return done(null, false, { message: "Wrong credentials!" });
				}

				if (!user.dataValues.isVerified) {
					return done(null, false, { message: "Verify your Account" });
				}
				return done(null, my_user);
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

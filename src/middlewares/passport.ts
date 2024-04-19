import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { hashPassword } from "../utils/password";
import { User } from "../database/models/User";

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
          role:"BUYER"
        };
        const user = await User.create({ ...data });
        if (!user) {
          return done(null, false, {
            message: "Something went wrong",
          });
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;

import passport from "passport"
import { Strategy as LocalStrategy } from 'passport-local';
import { hashPassword } from "../utils/password";
import { User } from "../database/models/User";



passport.serializeUser(function (user:any, done) {
  done(null, user);
});

passport.deserializeUser(function (user:any, done) {
  done(null, user);
});

passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const data = {
            email: email.trim(),
            password: await hashPassword(password),
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            phone:req.body.phone,
          };
          const createUser= await User.create({...data})     
              done(null,data);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  export default passport;
  
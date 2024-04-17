import { Request, Response } from "express";
import { NextFunction } from "express";
import { User } from "../database/models/User";
import passport from "passport";
import { generateAccessToken } from "../helpers/security.helpers";
import { UserModelAttributes } from "../database/models/User";
import { isValidPassword } from "../utils/password.checks";
import { HttpException } from "../utils/http.exception";
import validateLogIn from "../validations/login.validation";

interface InfoAttribute {
  message: string;
}

const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({ message: "List of all users", data: users });
};
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body) {
      passport.authenticate(
        "signup",
        (err: Error, user: UserModelAttributes, info: InfoAttribute) => {
          if (!user) {
            return res.status(500).json({
              message: info.message,
            });
          }
          req.login(user, async () => {
            if (err) {
              return res.status(500).json({
                message: "Something went wrong",
              });
            }
            const token = generateAccessToken({ id: user.id, role: user.role });
            res.status(201).json({
              status: 201,
              message: "Account Created successfully",
              token,
            });
          });
        }
      )(req, res, next);
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const error = validateLogIn(req.body);

    if (error)
      return res
        .status(400)
        .json(
          new HttpException(
            "BAD REQUEST",
            error.details[0].message.replace(/\"/g, "")
          )
        );

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user)
      return res
        .status(409)
        .json(new HttpException("CONFLICT", "Wrong credentials!").response());

    const isValidPass = isValidPassword(password, user?.dataValues.password as string);

    if (!isValidPass)
      return res
        .status(409)
        .json(new HttpException("CONFLICT", "Wrong credentials!").response());

    /**
     * Remember to include the ------isVerified---- in (line below) once the model is updated
     * and uncomment the ------ if statement ------
     */

    const { id, role } = user?.dataValues;

    // if (!isVerified)
    //   return res
    //     .status(403)
    //     .json(
    //       new HttpException(
    //         "FORBIDDEN",
    //         "Please verify your account to continue!"
    //       ).response()
    //     );

    const token = generateAccessToken({ id, role });

    const response = new HttpException(
      "SUCCESS",
      "Logged in to your account successfully!"
    ).response();

    /**
     *
     * ------- then after handle the redirection -------
     *
     * res.redirect("/")
     *
     * ------- Or ---------
     */

    return res.status(200).json({ ...response, token });
  } catch (error) {
    res
      .status(500)
      .json(
        new HttpException("SERVER ERROR", "Something went wrong!").response()
      );
  }
};

export default {
  login,
  registerUser,
  getUsers
};

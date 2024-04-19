import { userValidate } from "../validations/user.valid";
import { NextFunction, Request, Response } from "express";
import validateLogIn from "../validations/login.validation";
import { HttpException } from "../utils/http.exception";
import { User } from "../database/models/User";

const userEXist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body) {
      const { email } = req.body;
      const userEXist = await User.findOne({
        where: {
          email,
        },
      });
      if (userEXist) {
        return res
          .status(409)
          .json({ status: "confict", message: "User already exist!!" });
      }
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "middelware failed",
      error: error,
    });
  }
};
const userValid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body) {
      const { error } = userValidate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message.replace(/\"/g, ""),
        });
      }
    }
    next();
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

const logInValidated = (req: Request, res: Response, next: NextFunction) => {
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

  next();
};

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  return res.send(`<h1>Not authenticated!</h1>`);
};

export default {
  logInValidated,
  isAuthenticated,
  userEXist,
  userValid,
};

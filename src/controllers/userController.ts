import { Request, Response } from "express";
import { NextFunction } from "express";
import { User } from "../database/models/User";
import passport from "passport";
import { generateAccessToken } from "../helpers/security.helpers";
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({ message: "List of all users", data: users });
};
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body) {
      passport.authenticate("signup", (err: Error, user: any, info: any) => {
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
      })(req, res, next);
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

import { Request, Response } from "express";
import { User } from "../database/models/User";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({ message: "List of all users", data: users });
};

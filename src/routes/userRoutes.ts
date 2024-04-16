import express from "express";
import { getUsers } from "../controllers/userController";

const userRoutes = express.Router();

userRoutes.get("/users", getUsers);

export default userRoutes;

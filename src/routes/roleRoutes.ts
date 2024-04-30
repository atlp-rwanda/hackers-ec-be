import {
	createRole,
	assignRole,
	updateRole,
	allRole,
} from "../controllers/roleConroller";
import express from "express";
import {
	roleNameValid,
	roleIdValidations,
} from "../middlewares/role.middleware";
import { isAdmin } from "../middlewares/auth";
export const roleRoutes = express.Router();

roleRoutes.get("/roles/", isAdmin, allRole);
roleRoutes.post("/roles/", isAdmin, roleNameValid, createRole);
roleRoutes.post("/users/:userId/roles", isAdmin, roleIdValidations, assignRole);
roleRoutes.patch("/roles/:id", isAdmin, roleNameValid, updateRole);

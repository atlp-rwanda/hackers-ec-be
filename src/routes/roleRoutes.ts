import { createRole,assignRole,updateRole,deleteRole } from "../controllers/role";
import express from "express";
import { roleValid,roleIdValidations } from "../middlewares/role.middleware";
import { isAdmin } from "../middlewares/auth";
export const roleRoutes = express.Router();
 
roleRoutes.post("/",roleValid,isAdmin,createRole);
roleRoutes.post("/:userId/roles",isAdmin,roleIdValidations,assignRole);
roleRoutes.patch("/:id",isAdmin,updateRole);
roleRoutes.delete("/:id",isAdmin,deleteRole);

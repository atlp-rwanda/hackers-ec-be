import express from "express";
import userRoutes from "./userRoutes";
import { roleRoutes } from "./roleRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/users/", roleRoutes);
router.use("/roles", roleRoutes);


export default router;

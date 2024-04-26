import express from "express";
import userRoutes from "./userRoutes";
import { roleRoutes } from "./roleRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/", roleRoutes);

export default router;

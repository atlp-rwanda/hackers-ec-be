import express from "express";

import authenticate from "../middlewares/auth";
import { adminStatistics } from "../controllers/adminStatistics";

export const AdminstatisticsRouter = express.Router();

AdminstatisticsRouter.get(
	"/admin/stats",
	authenticate.authenticateUser,
	authenticate.isAdmin,
	adminStatistics,
);

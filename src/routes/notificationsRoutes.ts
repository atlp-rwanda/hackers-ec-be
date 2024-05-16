import express from "express";
import userAuthentication from "../middlewares/auth";
import {
	read_allNotifications,
	read_oneNotification,
	update_notification,
	mark_all_as_read,
	delete_notification,
} from "../controllers/notificationController";
const notificationRouter = express.Router();

notificationRouter.get(
	"/",
	userAuthentication.authenticateUser,
	read_allNotifications,
);

notificationRouter.get(
	"/:id",
	userAuthentication.authenticateUser,
	read_oneNotification,
);

notificationRouter.patch(
	"/:id",
	userAuthentication.authenticateUser,
	update_notification,
);

notificationRouter.patch(
	"/",
	userAuthentication.authenticateUser,
	mark_all_as_read,
);

notificationRouter.delete(
	"/:id",
	userAuthentication.authenticateUser,
	delete_notification,
);
export default notificationRouter;

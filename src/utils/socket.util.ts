// socketUtils.ts
import { Server } from "socket.io";
import * as http from "http";
import { insert_function, read_function } from "./db_methods";
import { messageModelAttributes } from "../types/model";
import { User } from "../database/models/User";
import { ExtendedSocket, isLogin } from "../middlewares/auth";
import { NotificationEmition } from "../types/model";

let io: Server;

export const config = (server: http.Server) => {
	io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	const include = [
		{
			model: User,
			as: "sender",
			attributes: ["id", "firstName", "lastName", "email", "role"],
		},
	];

	io.on("connection", async (socket: ExtendedSocket) => {
		io.use(async (socketInstance, next) => {
			if (await isLogin(socketInstance)) {
				next();
			} else {
				socket.disconnect(true);
			}
		});

		const userId = socket.user?.id;

		const messages = await read_function<messageModelAttributes>(
			"message",
			"findAll",
			{ include },
		);

		socket.emit("chat messages", messages);

		socket.on("send message", async (msg) => {
			const message = {
				senderId: userId,
				message: msg.message,
			};
			const sentMessage = await insert_function<messageModelAttributes>(
				"message",
				"create",
				message,
			);

			if (sentMessage.id) {
				const newMessage = await read_function("message", "findOne", {
					where: { id: sentMessage.id },
					include,
				});
				io.emit("new message", newMessage);
			}
		});
		socket.on("notification", (data) => {
			io.emit("notification", data);
		});
	});
};

export const emitNotification = (notifications: NotificationEmition[]) => {
	if (io) {
		notifications.forEach((notification) => {
			io.emit("notification", notification);
		});
	} else {
		console.error("Socket.io is not initialized.");
	}
};

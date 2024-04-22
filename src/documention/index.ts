import dotenv from "dotenv";
import swaggerDoc from "./swagger.json";
import { PORT } from "../utils/keys";
import users from "./user";

const defaults = swaggerDoc.paths;

dotenv.config();

const SERVER_HOST = process.env.HOST || `http://localhost:${PORT}`;

const host =
	process.env.DEV_MODE === "production"
		? (SERVER_HOST as string).split("https://")[1]
		: (SERVER_HOST as string).split("http://")[1];

const paths = {
	...defaults,
	...users,
};

const config = {
	swagger: "2.0",
	info: {
		title: "Hacker's E-commerce API",
		version: "1.0.0",
		description: "cAPI endpoints for hacker's e-commerce documented on swagger",
	},
	host,
	basePath: `/api/${process.env.API_VERSION || "v1"}`,
	schemes: ["http", "https"],
	securityDefinitions: {
		JWT: {
			type: "apiKey",
			name: "Authorization",
			in: "header",
			description: "Enter your JWT token in the format 'Bearer token'.",
		},
	},
	tags: [
		{
			name: "Hacker's E-commerce API Documentation",
		},
	],
	consumes: ["application/json"],
	produces: ["application/json"],
	paths,
};
export default config;

import express from "express";
import session from "express-session";
import passport from "./middlewares/passport";
import { SESSION_SECRET } from "./utils/keys";
import router from "./routes";
import config from "./documention";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { root_home_page } from "./utils/html.utils";
const app = express();
app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	}),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

const options = {
	swaggerDefinition: {
		...config,
	},
	apis: ["./src/documentation/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", router);
app.get("/api/v1", (_req, res) => {
	res.status(200).json({
		message: "Welcome to Hacker's e-commerce backend!",
	});
});
app.get("/", (_req, res) => {
	res.send(root_home_page);
});

export default app;

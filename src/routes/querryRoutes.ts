import express from "express";
import {
	read_allQuerries,
	read_oneQuerry,
	createQuerry,
} from "../controllers/querriesController";
import isQuerryValidated from "../middlewares/querryMiddleware";
import authentication from "../middlewares/auth";

const querryRouter = express.Router();

querryRouter.post("/", isQuerryValidated, createQuerry);
querryRouter.get("/", authentication.isAdmin, read_allQuerries);
querryRouter.get("/:id", authentication.isAdmin, read_oneQuerry);

export default querryRouter;

import express from "express";
import auth from "../middlewares/auth";
import { addItemToCart } from "../controllers/cartController";

const cartRouter = express.Router();

cartRouter.post("/", auth.authenticateUser, auth.isBuyer, addItemToCart);

export default cartRouter;

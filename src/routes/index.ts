import express from "express";
import userRoutes from "./userRoutes";
import { roleRoutes } from "./roleRoutes";
import productRouter from "./productRoutes";
import categoryRouter from "./categoryRoutes";
import chatRoutes from "./chatRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/", roleRoutes);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/chats", chatRoutes);

export default router;

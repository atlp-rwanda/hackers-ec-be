import express from "express";
import userRoutes from "./userRoutes";
import { roleRoutes } from "./roleRoutes";
import productRouter from "./productRoutes";
import categoryRouter from "./categoryRoutes";
import chatRoutes from "./chatRoutes";
import profileRouter from "./profileRouter";
import wishesRouter from "./wishesRoutes";
import cartRouter from "./cartRoutes";
import paymentRouter from "./paymentsRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/", roleRoutes);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/chats", chatRoutes);
router.use("/", profileRouter);
router.use("/wishes", wishesRouter);
router.use("/carts", cartRouter);
router.use("/payments", paymentRouter);

export default router;

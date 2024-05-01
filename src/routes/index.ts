import express from "express";
import userRoutes from "./userRoutes";
import { roleRoutes } from "./roleRoutes";
import productRouter from "./productRoutes";
import categoryRouter from "./categoryRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/", roleRoutes);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);

export default router;

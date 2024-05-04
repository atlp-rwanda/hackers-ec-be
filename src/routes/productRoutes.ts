import express from "express";
import userAuthentication from "../middlewares/auth";
import productController from "../controllers/productController";
import productMiddlewares from "../middlewares/product.middlewares";
import fileUpload from "../middlewares/multer";

const productRouter = express.Router();

productRouter.post(
	"/",
	userAuthentication.isSeller,
	fileUpload.array("images"),
	productMiddlewares.isValidProduct,
	productController.create_product,
);

productRouter.get(
	"/",
	userAuthentication.authenticateUser,
	productController.read_all_products,
);

productRouter.get(
	"/:id",
	userAuthentication.authenticateUser,
	productController.read_single_product,
);

productRouter.patch(
	"/:id",
	userAuthentication.isSeller,
	fileUpload.array("images"),
	productController.update_product,
);
productRouter.patch(
	"/:id/availability-status",
	productMiddlewares.productStatusValidated,
	userAuthentication.isSeller,
	productController.update_product_status,
);

productRouter.delete(
	"/:id",
	userAuthentication.isSeller,
	productController.delete_product,
);

export default productRouter;

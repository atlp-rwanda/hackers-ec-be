import basicInfo from "./basicInfo";
import { roles } from "./role";
import { users } from "./user";
import { categories } from "./category";
import { products } from "./product";
import { messages } from "./message";
import { wishes } from "./wishlist";
import { searches } from "./SearchProduct";
import { cartsDocRoutes } from "./carts/carts";
import { app_payments } from "./payments";

export default {
	...basicInfo,
	paths: {
		...users,
		...roles,
		...categories,
		...searches,
		...products,
		...messages,
		...wishes,
		...cartsDocRoutes,
		...app_payments,
	},
};

import basicInfo from "./basicInfo";
import { roles } from "./role";
import { users } from "./user";
import { categories } from "./category";
import { products } from "./product";
import { messages } from "./message";
<<<<<<< HEAD
import { wishes } from "./wishlist";
import { searches } from "./SearchProduct";
=======
import { cartsDocRoutes } from "./carts/carts";
>>>>>>> f12bd5e (feat(user cart): Implementation of user cart)

export default {
	...basicInfo,
	paths: {
		...users,
		...roles,
		...categories,
		...searches,
		...products,
		...messages,
<<<<<<< HEAD
		...wishes,
=======
		...cartsDocRoutes,
>>>>>>> f12bd5e (feat(user cart): Implementation of user cart)
	},
};

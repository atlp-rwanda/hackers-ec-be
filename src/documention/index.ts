import basicInfo from "./basicInfo";
import { roles } from "./role";
import { users } from "./user";

export default {
	...basicInfo,
	paths: {
		...users,
		...roles,
	},
};

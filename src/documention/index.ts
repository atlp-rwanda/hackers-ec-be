import basicInfo from "./basicInfo";
import { users } from "./user";

export default {
	...basicInfo,
	paths: {
		...users,
	},
};

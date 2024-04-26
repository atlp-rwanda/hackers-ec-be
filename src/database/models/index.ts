import { Sequelize } from "sequelize";
import Role_model from "./role";
import user_model from "./User";

const Models = (sequelize: Sequelize) => {
	const User = user_model(sequelize);
	const role = Role_model(sequelize);
	return { role, User };
};
export default Models;

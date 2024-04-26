import { DataTypes, Sequelize, Model, Optional, UUIDV4 } from "sequelize";
import database_models from "../config/db.config";
export interface roleModelAttributes {
	id: string;
	roleName: string;
}
export type roleCreationAttributes = Optional<roleModelAttributes, "id">;

export class Role extends Model<roleModelAttributes, roleCreationAttributes> {
	public static associate(models: { User: typeof database_models.User }) {
		Role.hasMany(models.User, { as: "Users", foreignKey: "role" });
	}
}
const Role_model = (sequelize: Sequelize) => {
	Role.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			roleName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "roles",
		},
	);
	return Role;
};
export default Role_model;

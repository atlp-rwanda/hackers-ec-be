import { DataTypes, Model, Optional, Sequelize, UUIDV4 } from "sequelize";
import database_models from "../config/db.config";
export interface UserModelAttributes {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: string;
	isVerified: boolean;
}
type UserCreationAttributes = Optional<UserModelAttributes, "id"> & {
	role?: string;
};
export class User extends Model<UserModelAttributes, UserCreationAttributes> {
	public static associate(models: { role: typeof database_models.role }) {
		User.belongsTo(models.role, { as: "Roles", foreignKey: "role" });
	}
}
const user_model = (sequelize: Sequelize) => {
	User.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			confirmPassword: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				allowNull: false,
				references: {
					model: "roles",
					key: "id",
				},
			},
			isVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: UUIDV4,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "users",
		},
	);
	return User;
};
export default user_model;

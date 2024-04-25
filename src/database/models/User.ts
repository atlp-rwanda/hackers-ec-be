import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

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

export class User extends Model<UserModelAttributes, UserCreationAttributes> {}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		userName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		confirmPassword: {
			type: DataTypes.STRING,
			allowNull: false
		},
		role: {
			type: DataTypes.ENUM("ADMIN", "BUYER", "SELLER"),
			allowNull: false,
			defaultValue: "BUYER"
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{
		sequelize: sequelizeConnection,
		tableName: "users"
	}
);

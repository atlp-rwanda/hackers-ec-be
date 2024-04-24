import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { UserCreationAttributes, UserModelAttributes } from "../../types/model";
import { Product } from "./product";
import database_models from "../config/db.config";

export class User extends Model<UserModelAttributes, UserCreationAttributes> {
	public id!: string;
	public userName!: string;
	public firstName!: string;
	public lastName!: string;
	public email!: string;
	public password!: string;
	public confirmPassword!: string;
	public role!: string;
	public isVerified!: boolean;

	public static associate(models: {
		Product: typeof Product;
		role: typeof database_models.role;
	}) {
		this.hasOne(models.Product, {
			foreignKey: "sellerId",
			as: "products",
		});
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

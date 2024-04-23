import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

export interface resetPasswordModelAtributes {
	id?: string;
	email: string;
	resetToken: string;
}

export class resetPassword extends Model<resetPasswordModelAtributes> {}

resetPassword.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		resetToken: {
			type: DataTypes.STRING(1000),
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		tableName: "resetPassword_tokens",
	},
);

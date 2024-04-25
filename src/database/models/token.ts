import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

// token interface
export interface TokenModelAttributes {
	id: string;
	token: string;
}
type TokenCreationAttributes = Optional<TokenModelAttributes, "id">;
export class Token extends Model<
	TokenModelAttributes,
	TokenCreationAttributes
> {}
Token.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		}
	},
	{
		sequelize: sequelizeConnection,
		tableName: "tokens"
	}
);

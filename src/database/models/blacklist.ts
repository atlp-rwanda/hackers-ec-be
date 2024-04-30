import { DataTypes, Model, Optional } from "sequelize";

import { sequelizeConnection } from "../config/db.config";

export interface BlacklistModelAtributes {
	id: string;
	token: string;
}

type BlacklistCreationAttributes = Optional<BlacklistModelAtributes, "id">;

export class Blacklist extends Model<
	BlacklistModelAtributes,
	BlacklistCreationAttributes
> {}

Blacklist.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: true,
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		tableName: "blacklisted_tokens",
	},
);

import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

export interface BlacklistModelAtributes{
    id: string,
    token: string
}

export class Blacklist extends Model<BlacklistModelAtributes> {};

Blacklist.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: sequelizeConnection,
        tableName: "Blacklisted_tokens"
    }
);
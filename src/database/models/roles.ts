

import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

export interface roleModelAttributes {
	id: string;
	roleName: string;
	permission: string;
}
export type roleCreationAttributes = Optional<roleModelAttributes, "id"> ;

export class Role extends Model<roleModelAttributes, roleCreationAttributes> {

    static associate  (models:any)  {
        Role.hasMany(models.UserRole, {
          foreignKey: 'roleId',
          as: 'UserRoles',
        });
    
      };
}

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
		permission: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		tableName: "roles",
	},
);


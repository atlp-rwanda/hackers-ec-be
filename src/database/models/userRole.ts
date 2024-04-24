import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

export interface userRoleModelAttributes {
	id: string;
	roleId: string;
	userId: string;
}
type userRoleCreationAttributes = Optional<userRoleModelAttributes, "id"> ;

export class userRole extends Model<userRoleModelAttributes, userRoleCreationAttributes> {

    static associate(models:any){
        userRole.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'User',
          });
      
          userRole.belongsTo(models.Role, {
            foreignKey: 'roleId',
            as: 'Role',
          });
        
    }
}
userRole.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		roleId: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
            references: {
                model: 'roles',
                key: 'id',
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
		},
	   userId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
            references: {
                model: 'users',
                key: 'id',
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
		},
	},
	{
		sequelize: sequelizeConnection,
		tableName: "userRoles",
	},
);

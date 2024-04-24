// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class userRoles extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   userRoles.init({
//     roleName: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'userRoles',
//   });
//   return userRoles;
// };

import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

export interface userRoleModelAttributes {
	id: string;
	roleId: string;
	userId: string;
  roleName:string;
}
type userRoleCreationAttributes = Optional<userRoleModelAttributes, "id"> ;

export class userRole extends Model<userRoleModelAttributes, userRoleCreationAttributes> {

    static associate(models:any){
        userRole.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'User',
            onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
          });
      
          userRole.belongsTo(models.Role, {
            foreignKey: 'roleId',
            as: 'Role',
            onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
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
             		},
                roleName: {
                  type: DataTypes.STRING,
                     references: {
                          model: 'roles',
                          key: 'roleName',
                        },
                           },

	},
	{
		sequelize: sequelizeConnection,
		tableName: "userRoles",
	},
);

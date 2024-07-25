import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { querriesModelAttributes } from "../../types/model";

export class Querries extends Model<querriesModelAttributes> {
	public id!: string;
	public firstName!: string;
	public lastName!: boolean;
	public subject!: string;
	public email!: string;
	public message!: string;
}

const querries_model = (sequelize: Sequelize) => {
	Querries.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
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
			subject: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			message: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},

		{
			sequelize,
			tableName: "querries",
		},
	);

	return Querries;
};

export default querries_model;

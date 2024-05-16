import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { User } from "./User";
import { Category } from "./category";
import {
	ProductAttributes,
	ProductCreationAttributes,
} from "../../types/model";
import database_models from "../config/db.config";

export class Product extends Model<
	ProductAttributes,
	ProductCreationAttributes
> {
	public id!: string;
	public name!: string;
	public price!: number;
	public images!: string[];
	public discount!: number;
	public quantity!: number;
	public sellerId!: string;
	public categoryId!: string;
	public expiryDate!: Date;
	public productStatus!: string;

	public static associate(models: {
		User: typeof User;
		Category: typeof Category;
		review: typeof database_models.review;
	}) {
		this.belongsTo(models.User, {
			foreignKey: "sellerId",
			as: "seller",
		});

		this.belongsTo(models.Category, {
			foreignKey: "categoryId",
			as: "category",
		});
		this.hasMany(models.review, { foreignKey: "productId", as: "product" });
	}
}

const product_model = (sequelize: Sequelize) => {
	Product.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			price: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			images: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				allowNull: false,
			},
			discount: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sellerId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
			categoryId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "categories",
					key: "id",
				},
			},
			expiryDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			productStatus: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Unavailable",
			},
		},
		{
			sequelize,
			tableName: "products",
		},
	);

	return Product;
};

export default product_model;
